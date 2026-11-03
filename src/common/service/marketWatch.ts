import { getUsdToIdrRate } from "@/function";
import type { BaseMarketItems, MarketResponseItems } from "@/common/types";

export async function fetchCryptoData(): Promise<BaseMarketItems[]> {
    
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=6&page=1`,
            {
                headers: { Accept: "application/json" },
                next: { revalidate: 7200 },
            }
        );

        if (!response.ok) {
            console.error(`[CRYPTO_SERVICE] API error: ${response.status}`);
            return [];
        }

        const data: MarketResponseItems[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.error(`[CRYPTO_SERVICE] Doesn't have an array 'coins' in the response.`);
            return [];
        }

        const usdToIdr = await getUsdToIdrRate();

        const cryptoItems: BaseMarketItems[] = data.map((coin) => {
            const currentPriceUsd = coin.current_price ?? 0;
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
                id: coin.id,
                name: coin.name || coin.displayName || coin.symbol || "Crypto",
                symbol: `${coin.symbol.toUpperCase()} / USD`,
                main_price: formattedMainPrice,
                sub_text: `1 coin ≈ ${formattedSubText}`,
                price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
                image: coin.image,
            };
        });

        return cryptoItems;
    } catch (error) {
        console.error("[CRYPTO_SERVICE] Failed to fetch crypto market data:", error);
        return [];
    }
}

export async function fetchStocksData(): Promise<BaseMarketItems[]> {
    
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=true&key=MOST_ACTIVES&count=6&scrIds=most_actives`, {
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
        const quotes: MarketResponseItems[] = json?.finance?.result?.[0]?.quotes || [];

        if (!Array.isArray(quotes) || quotes.length === 0) {
            console.warn("[STOCKS_SERVICE] Doesn't have an array 'quotes' in the response.");
            return [];
        }

        const usdToIdr = await getUsdToIdrRate();

        const stocksItems: BaseMarketItems[] = quotes.map((quote) => {
            const symbolStr = (quote.symbol || "UNKNOWN").toUpperCase();
            const companyName = quote.displayName || quote.shortName || quote.longName || symbolStr;
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