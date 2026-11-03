import { NextResponse, type NextRequest } from "next/server";
import { CheckRateLimit, getClientIP } from "@/utils";
import { Config } from "@/common/config";
import { getCryptoKey, encryptSession, decryptSession } from "@/utils/encryption";
import type { PortfolioSessionPayload } from "@/common/types";

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const isProd = Config.WebUrl.startsWith("https://");
    const proto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host") || "";
    const pathname = request.nextUrl.pathname;
    const webUrl = new URL(Config.WebUrl);
    const apiUrl = new URL(Config.ApiUrl);
    const baseHostname = webUrl.hostname.replace(/^www\./, "");
    const apiHost = apiUrl.host;
    const apiHostname = apiUrl.hostname;
    const wwwHost = `www.${baseHostname}`;
    const wwwOrigin = `${webUrl.protocol}//${wwwHost}`;

    if (isProd && proto && proto === "http") {
        const secureUrl = new URL(request.url);
        secureUrl.protocol = "https:";
        return NextResponse.redirect(secureUrl, 308);
    }

    const isApiSubdomain =
        host === apiHost ||
        host === apiHostname ||
        host.startsWith("api.localhost") ||
        (apiHostname !== baseHostname && host.startsWith("api."));

    if (isApiSubdomain && pathname.startsWith("/api")) {
        const cleanPath = pathname.replace(/^\/api/, "") || "/";
        const redirectUrl = new URL(cleanPath, request.url);
        return NextResponse.redirect(redirectUrl, 308);
    }

    if (isProd && (host === Config.BaseDomain || host === wwwHost || host === baseHostname) && pathname.startsWith("/api")) {
        const cleanPath = pathname.replace(/^\/api/, "") || "/";
        const redirectUrl = new URL(cleanPath, Config.ApiUrl);
        return NextResponse.redirect(redirectUrl, 308);
    }

    const isApiRoute = isApiSubdomain || pathname.startsWith("/api");
    const requestOrigin = request.headers.get("origin") || "";
    const allowedOrigins = [Config.WebUrl, wwwOrigin, Config.ApiUrl, "http://localhost:3000"];
    const corsOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : Config.WebUrl;

    if (isApiRoute && request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": corsOrigin,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                "Access-Control-Max-Age": "86400",
            },
        });
    }

    let rateLimitResult = { success: true, limit: 60, remaining: 60, reset: 60 };
    if (isApiRoute) {
        const clientIp = getClientIP(request);
        rateLimitResult = CheckRateLimit(clientIp, 60, 60000);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Too many requests. Please try again later.",
                    timestamp: new Date().toISOString(),
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rateLimitResult.reset),
                        "X-RateLimit-Limit": String(rateLimitResult.limit),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": String(rateLimitResult.reset),
                        "Access-Control-Allow-Origin": corsOrigin,
                    },
                }
            );
        }
    }
    
    let response: NextResponse;
    if (isApiSubdomain) {
        const rewriteUrl = new URL(`/api${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url);
        response = NextResponse.rewrite(rewriteUrl);
    } else {
        response = NextResponse.next();
    }

    if (isApiRoute) {
        response.headers.set("Access-Control-Allow-Origin", corsOrigin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
        response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
        response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));
    }

    const sessionCookie = request.cookies.get("portfolio_session")?.value;
    let userId = crypto.randomUUID();

    if (sessionCookie) {
        try {
            const cryptoKey = await getCryptoKey();
            const decodedData = await decryptSession(sessionCookie, cryptoKey);

            if (decodedData?.refresh_token) {
                userId = decodedData.refresh_token;
            }
        } catch {

        }
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresAt = nowInSeconds + (60 * 30); 

    const simpleSessionPayload: PortfolioSessionPayload = {
        refresh_token: userId,
        expires_at: expiresAt,
        is_anonymous: true
    };

    let encryptedSessionValue = "";

    try {
        const cryptoKey = await getCryptoKey();
        encryptedSessionValue = await encryptSession(simpleSessionPayload, cryptoKey);
    } catch {
        encryptedSessionValue = Buffer.from(JSON.stringify(simpleSessionPayload)).toString("base64url");
    }

    const cookieDomain = isProd && !baseHostname.includes("localhost") ? `.${baseHostname}` : undefined;

    response.cookies.set("portfolio_session", encryptedSessionValue, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 30,
        domain: cookieDomain,
    });

    const supabaseUrl = Config.Supabase.Url || "https://*.supabase.co";
    const scriptPolicy = `script-src 'self' 'unsafe-inline' https://*.cloudflare.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.cloudflareinsights.com${isProd ? "" : " 'unsafe-eval'"};`;
    const devConnectPolicy = isProd ? "" : " ws: wss:";

    response.headers.set(
        "Content-Security-Policy",
        `default-src 'self'; ` +
            scriptPolicy +
            `connect-src 'self' ${Config.WebUrl} ${Config.ApiUrl} https://*.${baseHostname} ${supabaseUrl} https://*.supabase.co https://*.cloudflare.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.cloudflareinsights.com${devConnectPolicy}; ` + 
            `style-src 'self' 'unsafe-inline'; ` +
            `img-src * data: blob:; ` + 
            `font-src 'self' data: https://fonts.gstatic.com; ` +
            `frame-src 'self' https://*.cloudflare.com https://challenges.cloudflare.com;`,
    );

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

export const config = {
    matcher: [
        "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp3|mp4|woff2?)$).*)",
    ],
};