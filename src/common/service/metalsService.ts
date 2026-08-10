import { BaseMarketItem, MarketChartResponse } from "@/common/types/playgorund";
import { getUsdToIdrRate } from "./currencyService";

interface MetalMetadata {
    id: string;
    name: string;
    symbol: string;
    ticker: string;
    unitLabel: string;
}

const METALS_METADATA: Record<string, MetalMetadata> = {
    GOLD: { id: "gold", name: "Gold (XAU)", symbol: "USD / OZ", ticker: "GC=F", unitLabel: "oz" },
    SILVER: { id: "silver", name: "Silver (XAG)", symbol: "USD / OZ", ticker: "SI=F", unitLabel: "oz" },
    PLATINUM: { id: "platinum", name: "Platinum (XPT)", symbol: "USD / OZ", ticker: "PL=F", unitLabel: "oz" },
    PALLADIUM: { id: "palladium", name: "Palladium (XPD)", symbol: "USD / OZ", ticker: "PA=F", unitLabel: "oz" },
    COPPER: { id: "copper", name: "Copper", symbol: "USD / LB", ticker: "HG=F", unitLabel: "lb" },
    ALUMINUM: { id: "aluminum", name: "Aluminum", symbol: "USD / MT", ticker: "ALI=F", unitLabel: "MT" },
};

function formatRupiah(amount: number): string {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function calculatePercentageChange(latest: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    const change = ((latest - previous) / previous) * 100;
    return Number(change.toFixed(2));
}

export async function fetchMetalsData(): Promise<BaseMarketItem[]> {
    const usdToIdr = await getUsdToIdrRate();
    const metalsList = Object.values(METALS_METADATA);
    const apiUrl = process.env.FINANCE_API_URL || "YOUR_API_URL";

    const requests = metalsList.map(async (meta) => {
        try {
            const response = await fetch(`${apiUrl}/${meta.ticker}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "application/json",
                },
                next: { revalidate: 7200 },
            });

            if (!response.ok) {
                console.error(`[METALS_SERVICE] API error: ${response.status}`);
                return null;
            }

            const data: MarketChartResponse = await response.json();
            const result = data.chart.result?.[0]?.meta;

            if (!result || typeof result.regularMarketPrice !== "number") return null;

            const price = result.regularMarketPrice;
            const previousPrice = result.chartPreviousClose || result.previousClose || price;
            const percentChange = calculatePercentageChange(price, previousPrice);
            const idrEquivalent = price * usdToIdr;
            const formattedPrice = price >= 1000 ? `$ ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$ ${price.toFixed(2)}`;

            const metalsItems: BaseMarketItem = {
                id: meta.id,
                name: meta.name,
                symbol: meta.symbol,
                main_price: formattedPrice,
                sub_text: `1 ${meta.unitLabel} ≈ ${formatRupiah(idrEquivalent)} IDR`,
                price_change_percentage_24h: percentChange,
            };

            return metalsItems;
        } catch (error) {
            console.error("[METALS_SERVICE] Failed to fetch metals market data:", error);
            return null;
        }
    });

    const results = await Promise.all(requests);
    return results.filter((item): item is BaseMarketItem => item !== null);
}