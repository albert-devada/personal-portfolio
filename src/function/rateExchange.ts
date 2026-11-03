import type { BaseMarketItems, MarketResponseItems } from "@/common/types";

export function formatRupiah(amount: number): string {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

export function calculatePercentageChange(latest: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    const change = ((latest - previous) / previous) * 100;
    return Number(change.toFixed(2));
}

export async function fetchRawTimeSeriesData(): Promise<MarketResponseItems> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = sevenDaysAgo.toISOString().split("T")[0];
    const apiUrl = `https://api.frankfurter.dev/v1/${startDate}..?base=USD&symbols=IDR,EUR,GBP,JPY,SGD,AUD`;

    const response = await fetch(apiUrl,
        {
            headers: { Accept: "application/json" },
            next: { revalidate: 86400 },
        }
    );

    if (!response.ok) {
        throw new Error(`[CURRENCY_SERVICE] API Error with status: ${response.status}`);
    }

    const data: MarketResponseItems = await response.json();
    if (!data || !data.rates) {
        throw new Error(`[CURRENCY_SERVICE] Doesn't have an array 'rates' in the response.`);
    }

    return data;
}

export async function getUsdToIdrRate(): Promise<number> {
    try {
        const data = await fetchRawTimeSeriesData();
        const sortedDates = Object.keys(data.rates).sort();
        if (sortedDates.length > 0) {
            const latestDate = sortedDates[sortedDates.length - 1];
            return data.rates[latestDate].IDR;
        }
    } catch (error) {
        console.error("[CURRENCY_SERVICE] Failed to get USD to IDR rate:", error);
    }
    return 16000;
}

export function AttachMarketIcons<item extends BaseMarketItems>(items: item[],metadataMap: Record<string, { id: string; icon: React.ElementType; iconColor: string }>): item[] {
    return items.map((item) => {
        const meta = Object.values(metadataMap).find((m) => m.id === item.id);
        return {...item, icon: meta?.icon, iconColor: meta?.iconColor};
    });
}