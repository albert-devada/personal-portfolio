import { NextResponse } from "next/server";
import { authors } from "@/common/constants";
import { VerifedSession } from "@/lib/server";
import { BaseMarketItem, NewsArticleItem } from "@/common/types";
import { fetchCryptoData, fetchStocksData, fetchMarketNewsData } from "@/common/service";

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

        const [cryptoResult, stocksResult, newsResult] = await Promise.allSettled([
            fetchCryptoData(),
            fetchStocksData(),
            fetchMarketNewsData(),
        ]);

        const cryptoData: BaseMarketItem[] = cryptoResult.status === "fulfilled" && Array.isArray(cryptoResult.value) ? cryptoResult.value : [];
        const stocksData: BaseMarketItem[] = stocksResult.status === "fulfilled" && Array.isArray(stocksResult.value) ? stocksResult.value : [];
        const newsData: NewsArticleItem[] = newsResult.status === "fulfilled" && Array.isArray(newsResult.value) ? newsResult.value : [];
        const allFailed = cryptoData.length === 0 && stocksData.length === 0 && newsData.length === 0;

        if (allFailed) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: { crypto: cryptoData, stocks: stocksData, sentiment: newsData }, timestamp: new Date().toISOString() },
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
