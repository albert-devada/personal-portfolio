import { NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";
import { ValidateSession, fetchCryptoData, fetchStocksData } from "@/common/service";
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

        const [cryptoResult, stocksResult] = await Promise.allSettled([
            fetchCryptoData(),
            fetchStocksData(),
        ]);

        const cryptoData: BaseMarketItems[] = cryptoResult.status === "fulfilled" && Array.isArray(cryptoResult.value) ? cryptoResult.value : [];
        const stocksData: BaseMarketItems[] = stocksResult.status === "fulfilled" && Array.isArray(stocksResult.value) ? stocksResult.value : [];
        const allFailed = cryptoData.length === 0 && stocksData.length === 0;

        if (allFailed) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: { crypto: cryptoData, stocks: stocksData }, timestamp: new Date().toISOString() },
            { status: 200 }
        );

    } catch (error) {

        console.error("[MARKET_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}
