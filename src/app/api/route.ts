import { NextResponse, type NextRequest } from "next/server";
import { API_CONFIG } from "@/common/config";
import { getApiUrl } from "@/function";

export const dynamic = "force-dynamic";

const apiEndpoints = (baseUrl: string) => [
    { name: "System Health", path: `${baseUrl}/health`, method: "GET" },
    { name: "Vulnerability Data", path: `${baseUrl}/vulndata`, method: "GET" },
    { name: "Vulnerability Search", path: `${baseUrl}/search?vulndata={cve_id}`, method: "POST" },
    { name: "CVE Data Feed", path: `${baseUrl}/cvedata`, method: "GET" },
    { name: "CVE Data Search", path: `${baseUrl}/search?cvedata={cve_id}`, method: "POST" },
    { name: "Data Breach Search", path: `${baseUrl}/search?breach={your_emails}`, method: "POST" },
    { name: "Currency & Commodities", path: `${baseUrl}/exchange`, method: "GET" },
    { name: "Crypto & US Stocks", path: `${baseUrl}/market`, method: "GET" },
];

export async function GET(request: NextRequest) {
    const baseUrl = getApiUrl("", request);
    return NextResponse.json({
        success: true,
        message: "Welcome to Albert Devada Public API Service for Developers",
        meta: API_CONFIG,
        endpoints: apiEndpoints(baseUrl),
        timestamp: new Date().toISOString(),
    }, {
        status: 200,
        headers: { "Cache-Control": "public, max-age=3600" },
    });
}

export async function POST(request: NextRequest) {
    return GET(request);
}