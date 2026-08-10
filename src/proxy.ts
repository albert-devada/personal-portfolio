import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

interface PortfolioSessionPayload {
    refresh_token: string;
    expires_at: number;
    is_anonymous: boolean;
}

const SECRET_KEY_RAW = process.env.APP_KEY || "albertdevada__portfolio_secret_key_64bytes";

async function getCryptoKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET_KEY_RAW);
    const hash = await crypto.subtle.digest("SHA-256", keyData);
    return await crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function encryptSession(data: PortfolioSessionPayload, cryptoKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encodedData);
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    return Buffer.from(combined).toString("base64");
}

async function decryptSession(base64Data: string, cryptoKey: CryptoKey): Promise<PortfolioSessionPayload | null> {
    const combined = Buffer.from(base64Data, "base64");

    if (combined.length < 13) return null;

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ciphertext);
    return JSON.parse(new TextDecoder().decode(decryptedBuffer)) as PortfolioSessionPayload;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const isProd = process.env.NODE_ENV === "production";
    const proto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host") || "";
    const pathname = request.nextUrl.pathname;

    let baseHost = "";
    let baseOrigin = "";
    let apiHost = "";
    let wwwHost = "";
    let apiOrigin = "";
    let wwwOrigin = "";

    if (isProd && process.env.APP_DOMAIN) {
        const rawDomain = process.env.APP_DOMAIN.trim();
        try {
            const parsedUrl = new URL(rawDomain.startsWith("http") ? rawDomain : `https://${rawDomain}`);
            baseHost = parsedUrl.hostname.replace(/^www\./, "");
            baseOrigin = `${parsedUrl.protocol}//${baseHost}`;
            apiHost = `api.${baseHost}`;
            wwwHost = `www.${baseHost}`;
            apiOrigin = `${parsedUrl.protocol}//${apiHost}`;
            wwwOrigin = `${parsedUrl.protocol}//${wwwHost}`;
        } catch {
            baseHost = host;
            baseOrigin = `https://${host}`;
            apiHost = `api.${host}`;
            wwwHost = `www.${host}`;
            apiOrigin = `https://${apiHost}`;
            wwwOrigin = `https://${wwwHost}`;
        }
    } else {
        baseHost = "localhost";
        apiHost = "api.localhost";
        wwwHost = "localhost";
        baseOrigin = "http://localhost:3000";
        wwwOrigin = "http://localhost:3000";
        apiOrigin = "http://localhost:3000";
    }

    if (isProd && proto && proto === "http") {
        const secureUrl = new URL(request.url);
        secureUrl.protocol = "https:";
        return NextResponse.redirect(secureUrl, 308);
    }

    const isApiSubdomain = host.startsWith(apiHost) || host.startsWith("api.localhost");

    if (isApiSubdomain && pathname.startsWith("/api")) {
        const cleanPath = pathname.replace(/^\/api/, "") || "/";
        const redirectUrl = new URL(cleanPath, request.url);
        return NextResponse.redirect(redirectUrl, 308);
    }

    if (isProd && (host === baseHost || host === wwwHost) && pathname.startsWith("/api")) {
        const cleanPath = pathname.replace(/^\/api/, "") || "/";
        const redirectUrl = new URL(cleanPath, apiOrigin);
        return NextResponse.redirect(redirectUrl, 308);
    }

    const isApiRoute = isApiSubdomain || pathname.startsWith("/api");
    const requestOrigin = request.headers.get("origin") || "";
    const allowedOrigins = [baseOrigin, wwwOrigin, "http://localhost:3000"];
    const corsOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : baseOrigin;

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
        const clientIp =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "127.0.0.1";

        rateLimitResult = checkRateLimit(clientIp, 60, 60000);

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
        encryptedSessionValue = btoa(JSON.stringify(simpleSessionPayload));
    }

    const cookieDomain = isProd && baseHost ? `.${baseHost}` : undefined;

    response.cookies.set("portfolio_session", encryptedSessionValue, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 30,
        domain: cookieDomain,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://*.supabase.co";
    const scriptPolicy = `script-src 'self' 'unsafe-inline' https://*.cloudflare.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.cloudflareinsights.com${isProd ? "" : " 'unsafe-eval'"};`;
    const devConnectPolicy = isProd ? "" : " ws: wss:";

    response.headers.set(
        "Content-Security-Policy",
        `default-src 'self'; ` +
            scriptPolicy +
            `connect-src 'self' ${apiOrigin} ${supabaseUrl} https://*.supabase.co https://*.cloudflare.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.cloudflareinsights.com${devConnectPolicy}; ` + 
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
        "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
