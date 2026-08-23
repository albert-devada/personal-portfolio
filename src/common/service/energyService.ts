import { getUsdToIdrRate } from "./currencyService";
import { BaseMarketItem, MarketChartResponse } from "@/common/types";

interface EnergyMetadata {
    id: string;
    name: string;
    symbol: string;
    ticker: string;
    unitLabel: string;
}

const ENERGY_METADATA: Record<string, EnergyMetadata> = {
    CRUDE_OIL: { id: "crude-oil", name: "Crude Oil (Brent)", symbol: "USD / BBL", ticker: "BZ=F", unitLabel: "bbl" },
    NATURAL_GAS: { id: "natural-gas", name: "Natural Gas", symbol: "USD / MMBTU", ticker: "NG=F", unitLabel: "MMBtu" },
    GASOLINE: { id: "gasoline", name: "RBOB Gasoline", symbol: "USD / GAL", ticker: "RB=F", unitLabel: "gal" },
    COAL: { id: "coal", name: "Newcastle Coal", symbol: "USD / MT", ticker: "BTU", unitLabel: "MT" },
    URANIUM: { id: "uranium", name: "Uranium", symbol: "USD / LB", ticker: "URA", unitLabel: "lb" },
    CARBON: { id: "carbon", name: "Carbon Credits", symbol: "USD / TCO2E", ticker: "KRBN", unitLabel: "tCO2e" },
};

function formatRupiah(amount: number): string {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function calculatePercentageChange(latest: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    const change = ((latest - previous) / previous) * 100;
    return Number(change.toFixed(2));
}

export async function fetchEnergyData(): Promise<BaseMarketItem[]> {
    const usdToIdr = await getUsdToIdrRate();
    const energyList = Object.values(ENERGY_METADATA);
    const apiUrl = process.env.FINANCE_API_URL || "YOUR_API_URL";

    const requests = energyList.map(async (meta) => {
        try {
            const response = await fetch(`${apiUrl}/${meta.ticker}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "application/json",
                },
                next: { revalidate: 7200 },
            });

            if (!response.ok) {
                console.error(`[ENERGY_SERVICE] API error: ${response.status}`);
                return null;
            }

            const data: MarketChartResponse = await response.json();
            const result = data.chart.result?.[0]?.meta;

            if (!result || typeof result.regularMarketPrice !== "number") return null;

            const price = result.regularMarketPrice;
            const previousPrice = result.chartPreviousClose || result.previousClose || price;
            const percentChange = calculatePercentageChange(price, previousPrice);
            const idrEquivalent = price * usdToIdr;

            const energyItems: BaseMarketItem = {
                id: meta.id,
                name: meta.name,
                symbol: meta.symbol,
                main_price: `$ ${price.toFixed(2)}`,
                sub_text: `1 ${meta.unitLabel} ≈ ${formatRupiah(idrEquivalent)} IDR`,
                price_change_percentage_24h: percentChange,
            };

            return energyItems;

        } catch (error) {
            console.error("[ENERGY_SERVICE] Failed to fetch energy market data:", error);
            return null;
        }
    });

    const results = await Promise.all(requests);
    return results.filter((item): item is BaseMarketItem => item !== null);
}