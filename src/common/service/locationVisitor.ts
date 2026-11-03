import { cookies, headers } from "next/headers";
import { Config, resolveIpAddress } from "@/common/config";
import type { GeoLocationData, VisitorDetails } from "@/common/types";

function formatCustomFlagUrl(data: GeoLocationData): GeoLocationData {
    if (data?.country_code) {
        const countryCode = data.country_code.toLowerCase();
        data.flag = { ...data.flag, img: `https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/${countryCode}.svg`};
    }
    return data;
}

export async function getVisitorDetails(fetchGeo = false): Promise<VisitorDetails> {
    let ipAddress = "127.0.0.1";
    let geoLocationData: GeoLocationData | null = null;

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
        
        ipAddress = resolveIpAddress(ipAddress);
        const userAgent = headerList.get("user-agent") || "Unknown User Agent";

        if (fetchGeo) {
            const cachedGeoCookie = cookieStore.get("visitor_cache")?.value;

            if (cachedGeoCookie) {
                try {
                    const parsedCache = JSON.parse(cachedGeoCookie) as GeoLocationData;
                    if (parsedCache && parsedCache.ip === ipAddress) {
                        geoLocationData = formatCustomFlagUrl(parsedCache);
                    }
                } catch (error) {
                    geoLocationData = null;
                    const errorMsg = error instanceof Error ? error.message : "Invalid JSON";
                    console.warn(`[Location Visitor] Invalid "visitor cache" cookie | IP: ${ipAddress} | Detail: ${errorMsg}`);
                }
            }

            if (!geoLocationData && Config.Geolocation.ApiUrl) {
                const cleanApiUrl = Config.Geolocation.ApiUrl.replace(/\/+$/, "");
                const apiUrl = `${cleanApiUrl}/${ipAddress}`;
                const response = await fetch(apiUrl, {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 86400 }
                });

                if (response.ok) {
                    const rawData = (await response.json()) as GeoLocationData;
                    geoLocationData = formatCustomFlagUrl(rawData);
                }
            }
        }

        return { 
            ipAddress, 
            userAgent, 
            GeoLocationData: geoLocationData 
        };
        
    } catch {
        return { 
            ipAddress: resolveIpAddress(ipAddress), 
            userAgent: "Unknown User Agent", 
            GeoLocationData: null 
        };
    }
}