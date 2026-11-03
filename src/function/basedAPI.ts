const isDev = process.env.NODE_ENV === "development";
const rawWebUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:3000";

const formatDomainUrl = (url: string = ""): string => {
    if (!url) return "";
    const cleanDomain = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
    if (!cleanDomain) return "";
    const protocol = isDev ? "http://" : "https://";
    return `${protocol}${cleanDomain}`;
};

const WebUrl = formatDomainUrl(rawWebUrl);
const ApiUrl = formatDomainUrl(rawApiUrl);

export function getApiUrl(endpointPath: string = "", request?: Request | { headers: Headers }): string {
    const cleanEndpoint = endpointPath.trim().replace(/^\/?api(\/|$)/i, "").replace(/^\/+/, "");
    let baseUrl: string;

    if (WebUrl.startsWith("https://")) {
        baseUrl = ApiUrl;
    } else if (request) {
        const host = request.headers.get("host") || "localhost:3000";
        const proto = request.headers.get("x-forwarded-proto") || "http";
        baseUrl = `${proto}://${host}/api`;
    } else if (typeof window !== "undefined") {
        baseUrl = "/api";
    } else {
        baseUrl = `${WebUrl}/api`;
    }

    return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
}