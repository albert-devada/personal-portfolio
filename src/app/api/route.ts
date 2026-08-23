import { authors } from "@/common/constants";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

function getApiBaseUrl(request: NextRequest): string {
    const isProd = process.env.NODE_ENV === "production";
    const appDomainEnv = process.env.APP_DOMAIN;

    if (isProd && appDomainEnv) {
        try {
            const parsedUrl = new URL(appDomainEnv.startsWith("http") ? appDomainEnv : `https://${appDomainEnv}`);
            const baseHost = parsedUrl.hostname.replace(/^www\./, "");
            return `${parsedUrl.protocol}//api.${baseHost}`;
        } catch {
            const host = request.headers.get("host") || "localhost:3000";
            const proto = request.headers.get("x-forwarded-proto") || "https";
            return `${proto}://${host}`;
        }
    }

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
    const baseUrl = getApiBaseUrl(request);

    return NextResponse.json(
        {
            success: true,
            message: "Welcome to Albert Devada Public API Service for Developers",
            meta: API_CONFIG,
            endpoints: [
                { name: "System Health", path: `${baseUrl}/health`, method: "GET" },
                { name: "CVE Data Feed", path: `${baseUrl}/cvedata`, method: "GET" },
                { name: "CVE Search", path: `${baseUrl}/cvesearch`, method: "POST" },
                { name: "Vulnerability Data", path: `${baseUrl}/vulndata`, method: "GET" },
                { name: "Vulnerability Search", path: `${baseUrl}/vulnsearch`, method: "POST" },
                { name: "Data Breach Check", path: `${baseUrl}/breach`, method: "POST" },
                { name: "Exchange Rates", path: `${baseUrl}/exchange`, method: "GET" },
                { name: "Market News", path: `${baseUrl}/market`, method: "GET" },
                { name: "Image Service", path: `${baseUrl}/image`, method: "GET" },
            ],
            timestamp: new Date().toISOString(),
        },
        { status: 200 }
    );
}
