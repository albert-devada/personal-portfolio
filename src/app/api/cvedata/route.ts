import { NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";
import { ValidateSession, fetchCVEData } from "@/common/service";

export const dynamic = "force-dynamic";
const getMeta = () => ({ ...API_CONFIG });

export async function GET() {
    try {
        const clientSession = await ValidateSession();

        if (!clientSession) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Your request is invalid, Please try again.", timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const CveData = await fetchCVEData();

        if (!CveData || (Array.isArray(CveData) && CveData.length === 0)) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: CveData, timestamp: new Date().toISOString() },
            { status: 200 }
        );
    } catch (error) {
        console.error("[CVE_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}