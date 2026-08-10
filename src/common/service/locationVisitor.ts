import { cookies, headers } from "next/headers";
import { GeoLocationData, VisitorDetails } from "@/lib/utils";

export async function getVisitorDetails(fetchGeo = false): Promise<VisitorDetails> {
    let ipAddress = "127.0.0.1";
    let GeoLocationData: GeoLocationData | null = null;
    const isLocal = process.env.NODE_ENV === "development";
    const devFallbackIp = process.env.DEV_FALLBACK_IP || "8.8.8.8";

    try {
        const headerList = await headers();
        const cookieStore = await cookies();
        const cfConnectingIp = headerList.get("cf-connecting-ip");
        const xRealIp = headerList.get("x-real-ip");
        const xForwardedFor = headerList.get("x-forwarded-for");

        if (cfConnectingIp) {
            ipAddress = cfConnectingIp.trim();
        } else if (xRealIp) {
            ipAddress = xRealIp.trim();
        } else if (xForwardedFor) {
            ipAddress = xForwardedFor.split(",")[0].trim();
        }
        
        if (isLocal || ["::1", "127.0.0.1", "::ffff:127.0.0.1"].some(local => ipAddress.includes(local))) {
            ipAddress = isLocal ? devFallbackIp : "127.0.0.1"; 
        }

        const userAgent = headerList.get("user-agent") || "Unknown User Agent";

        if (fetchGeo) {
            const cachedGeoCookie = cookieStore.get("visitor_cache")?.value;

            if (cachedGeoCookie) {
                const parsedCache = JSON.parse(cachedGeoCookie) as GeoLocationData;

                if (parsedCache && parsedCache.ip === ipAddress) {
                    GeoLocationData = parsedCache;
                }
            }

            if (!GeoLocationData) {
                const apiUrl = `${process.env.GEOLOCATION_API_URL || "YOUR_API_URL"}/${ipAddress}`;
                const response = await fetch(apiUrl, {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 86400 }
                });

                if (response.ok) {
                    GeoLocationData = await response.json() as GeoLocationData;
                }
            }
        }

        return { ipAddress, userAgent, GeoLocationData };
        
    } catch {
        return { ipAddress, userAgent: "Unknown User Agent", GeoLocationData: null };
    }
}