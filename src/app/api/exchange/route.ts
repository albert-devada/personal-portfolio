import { NextResponse } from "next/server";
import { VerifedSession } from "@/lib/session";
import { fetchCurrencyData } from "@/common/service/currencyService";
import { fetchEnergyData } from "@/common/service/energyService";
import { fetchMetalsData } from "@/common/service/metalsService";
import { authors } from "@/common/constants/author";
import { BaseMarketItem } from "@/common/types/playgorund";
export const dynamic = "force-dynamic";

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

const getMeta = () => ({ ...API_CONFIG });

export async function GET() {
    
    try {

        const clientSession = await VerifedSession();

        if (!clientSession) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Your request is invalid, Please try again.", timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const [currencyResult, energyResult, metalsResult] = await Promise.allSettled([
            fetchCurrencyData(),
            fetchEnergyData(),
            fetchMetalsData(),
        ]);

        const currencyData: BaseMarketItem[] = currencyResult.status === "fulfilled" && Array.isArray(currencyResult.value) ? currencyResult.value : [];
        const energyData: BaseMarketItem[] = energyResult.status === "fulfilled" && Array.isArray(energyResult.value) ? energyResult.value : [];
        const metalsData: BaseMarketItem[] = metalsResult.status === "fulfilled" && Array.isArray(metalsResult.value) ? metalsResult.value : [];
        const allFailed = currencyData.length === 0 && energyData.length === 0 && metalsData.length === 0;

        if (allFailed) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: { currency: currencyData, energy: energyData, metals: metalsData }, timestamp: new Date().toISOString() },
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
