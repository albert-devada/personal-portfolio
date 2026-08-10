import { BaseMarketItem } from "@/common/types/playgorund";
import { getUsdToIdrRate } from "./currencyService";

interface YahooQuote {
    symbol?: string;
    shortName?: string;
    displayName?: string;
    longName?: string;
    regularMarketPrice?: { raw?: number } | number;
    regularMarketChangePercent?: { raw?: number } | number;
}

export async function fetchStocksData(): Promise<BaseMarketItem[]> {
    const apiUrl = `${process.env.STOCKS_API_URL}?formatted=true&key=MOST_ACTIVES&count=6&scrIds=most_actives` || "YOUR_API_URL";

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "application/json",
            },
            next: { revalidate: 7200 },
        });

        if (!response.ok) {
            console.error(`[STOCKS_SERVICE] API error: ${response.status}`);
            return [];
        }

        const json = await response.json();
        const quotes: YahooQuote[] = json?.finance?.result?.[0]?.quotes || [];

        if (!Array.isArray(quotes) || quotes.length === 0) {
            console.warn("[STOCKS_SERVICE] Doesn't have an array 'quotes' in the response.");
            return [];
        }

        const usdToIdr = await getUsdToIdrRate();

        const stocksItems: BaseMarketItem[] = quotes.map((quote) => {
            const symbolStr = (quote.symbol || "UNKNOWN").toUpperCase();
            const companyName = quote.displayName || symbolStr;
            const currentPriceUsd = typeof quote.regularMarketPrice === "object" ? quote.regularMarketPrice?.raw ?? 0 : typeof quote.regularMarketPrice === "number" ? quote.regularMarketPrice : 0;
            const percentChange = typeof quote.regularMarketChangePercent === "object" ? quote.regularMarketChangePercent?.raw ?? 0 : typeof quote.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : 0;
            const priceInIdr = currentPriceUsd * usdToIdr;
            
            const formattedMainPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: currentPriceUsd < 1 ? 4 : 2,
                maximumFractionDigits: currentPriceUsd < 1 ? 4 : 2,
            }).format(currentPriceUsd);

            const formattedSubText = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(priceInIdr);

            return {
                id: `stock-${symbolStr.toLowerCase()}`,
                name: companyName,
                symbol: `${symbolStr} / USD`,
                main_price: formattedMainPrice,
                sub_text: `1 share ≈ ${formattedSubText}`,
                price_change_percentage_24h: Number(percentChange.toFixed(2)),
                image: `https://financialmodelingprep.com/image-stock/${symbolStr}.png`,
            };
        });

        return stocksItems;
    } catch (error) {
        console.error("[STOCKS_SERVICE] Failed to fetch stocks market data:", error);
        return [];
    }
}