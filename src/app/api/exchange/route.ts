import { NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";
import { ValidateSession, fetchCurrencyData, fetchEnergyData } from "@/common/service";
import type { BaseMarketItems } from "@/common/types";

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

        const [currencyResult, energyResult] = await Promise.allSettled([
            fetchCurrencyData(),
            fetchEnergyData(),
        ]);

        const currencyData: BaseMarketItems[] = currencyResult.status === "fulfilled" && Array.isArray(currencyResult.value) ? currencyResult.value : [];
        const energyData: BaseMarketItems[] = energyResult.status === "fulfilled" && Array.isArray(energyResult.value) ? energyResult.value : [];
        const allFailed = currencyData.length === 0 && energyData.length === 0;

        if (allFailed) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: { currency: currencyData, energy: energyData}, timestamp: new Date().toISOString() },
            { status: 200 }
        );

    } catch (error) {

        console.error("[EXCHANGE_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
        
    }
}