/**
 * Helper to get the full API endpoint URL dynamically based on environment and domain:
 * - Local Development: /api/endpoint (e.g., /api/breach)
 * - Production: https://api.[domain]/endpoint
 */
export function getApiUrl(endpointPath: string): string {
    const cleanEndpoint = endpointPath.replace(/^\/api\//, "/").replace(/^\/api$/, "/").replace(/^\//, "");

    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
        const envDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN;
        let baseHost = window.location.hostname;
        
        if (envDomain) {
            try {
                const parsedUrl = new URL(envDomain.startsWith("http") ? envDomain : `https://${envDomain}`);
                baseHost = parsedUrl.hostname;
            } catch {
                baseHost = window.location.hostname;
            }
        }

        baseHost = baseHost.replace(/^www\./, "");
        const protocol = window.location.protocol || "https:";
        
        if (baseHost.startsWith("api.")) {
            return `${protocol}//${baseHost}/${cleanEndpoint}`;
        }

        return `${protocol}//api.${baseHost}/${cleanEndpoint}`;
    }

    return `/api/${cleanEndpoint}`;
}

export function getApiOptions(options: RequestInit = {}): RequestInit {
    return {
        ...options,
        credentials: "include",
    };
}
