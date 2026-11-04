import "server-only";

const isDev = process.env.NODE_ENV === "development";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Portfolio";
const appKeys = process.env.APP_KEYS || "";
const rawWebUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:3000";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const rawTurnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const rawTurnstileSecretKey = process.env.TURNSTILE_SECRET_KEY || "";

const rawDevFallbackIp = process.env.DEV_FALLBACK_IP || "8.8.8.8";
const rawGeolocationApiUrl = process.env.GEOLOCATION_API_URL || "https://YOUR_API_URL";

/**
* URL Normalization:
* 1. Removes protocols (http://, https://), the www prefix, and all subpaths/query/hash (/dashboard, etc.).
* 2. If in development mode (isDev) -> automatically becomes "http://domain"
* 3. If in production mode -> automatically becomes "https://domain"
*
* End result: always pure "http://domain" (dev) or "https://domain" (prod)
*/
export const formatDomainUrl = (url: string = ""): string => {
    if (!url) return "";
    const cleanDomain = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
    if (!cleanDomain) return "";
    const protocol = isDev ? "http://" : "https://";
    return `${protocol}${cleanDomain}`;
};

/**
* A clean domain with no protocol, no www, and no path
* Example: "albertdevada.me" or "localhost:3000"
*/
export const getCleanDomain = (url: string = ""): string => {
    return (url || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
};

/**
* IP Address Normalization & Fallback Resolution:
* 1. If in development mode (isDev) -> automatically returns fallback IP (default: "8.8.8.8")
* 2. If IP is localhost or loopback (127.0.0.1, ::1, etc.) -> automatically returns fallback IP
* 3. Otherwise -> returns the detected client IP
*
* End result: caller doesn't need to know or handle `isDev`
*/
export const resolveIpAddress = (rawIp: string = "127.0.0.1"): string => {
    const isLocalIp = !rawIp || ["::1", "127.0.0.1", "::ffff:127.0.0.1"].some((local) => rawIp.includes(local));
    if (isDev || isLocalIp) {
        return rawDevFallbackIp;
    }
    return rawIp;
};

export const Config = {
    AppName: appName,
    AppKeys: appKeys,
    WebUrl: formatDomainUrl(rawWebUrl),
    ApiUrl: formatDomainUrl(rawApiUrl),
    BaseDomain: getCleanDomain(rawWebUrl),
    Geolocation: {
        ApiUrl: rawGeolocationApiUrl,
        FallbackIp: rawDevFallbackIp,
    },
    resolveIpAddress,
    Supabase: {
        Url: rawSupabaseUrl,
        Key: rawSupabaseKey,
    },
    Turnstile: {
        SiteKey: rawTurnstileSiteKey,
        SecretKey: rawTurnstileSecretKey,
    },
} as const;