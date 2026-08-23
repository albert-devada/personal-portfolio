import { BaseMarketItem } from "@/common/types";

interface SingleDayRates {
    AUD: number;
    EUR: number;
    GBP: number;
    IDR: number;
    JPY: number;
    SGD: number;
}

interface TimeSeriesResponse {
    amount: number;
    base: string;
    start_date: string;
    end_date: string;
    rates: Record<string, SingleDayRates>;
}

const CURRENCY_METADATA: Record<string, { name: string; symbol: string; image: string }> = {
    IDR: { name: "IDR", symbol: "USD / IDR", image: "https://flagcdn.com/w80/id.png" },
    EUR: { name: "Euro", symbol: "USD / EUR", image: "https://flagcdn.com/w80/eu.png" },
    GBP: { name: "Pound Sterling", symbol: "USD / GBP", image: "https://flagcdn.com/w80/gb.png" },
    JPY: { name: "Japanese Yen", symbol: "USD / JPY", image: "https://flagcdn.com/w80/jp.png" },
    SGD: { name: "Singapore Dollar", symbol: "USD / SGD", image: "https://flagcdn.com/w80/sg.png" },
    AUD: { name: "Australian Dollar", symbol: "USD / AUD", image: "https://flagcdn.com/w80/au.png" },
};

function formatRupiah(amount: number): string {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function calculatePercentageChange(latest: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    const change = ((latest - previous) / previous) * 100;
    return Number(change.toFixed(2));
}

async function fetchRawTimeSeriesData(): Promise<TimeSeriesResponse> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = sevenDaysAgo.toISOString().split("T")[0];
    const apiUrl = `${process.env.CURRENCY_API_URL}/${startDate}..?base=USD&symbols=IDR,EUR,GBP,JPY,SGD,AUD` || "YOUR_API_URL";

    const response = await fetch(apiUrl,
        {
            headers: { Accept: "application/json" },
            next: { revalidate: 86400 },
        }
    );

    if (!response.ok) {
        throw new Error(`[CURRENCY_SERVICE] API Error with status: ${response.status}`);
    }

    const data: TimeSeriesResponse = await response.json();
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

export async function fetchCurrencyData(): Promise<BaseMarketItem[]> {
    const data = await fetchRawTimeSeriesData();
    const sortedDates = Object.keys(data.rates).sort();

    if (sortedDates.length === 0) {
        throw new Error("[CURRENCY_SERVICE] No currency 'rates' returned.");
    }

    const latestDate = sortedDates[sortedDates.length - 1];
    const previousDate = sortedDates.length > 1 ? sortedDates[sortedDates.length - 2] : latestDate;
    const latestRates = data.rates[latestDate];
    const previousRates = data.rates[previousDate];
    const usdToIdr = latestRates.IDR;

    const currencyItems: BaseMarketItem[] = [
        {
            id: "usd-idr",
            name: CURRENCY_METADATA.IDR.name,
            symbol: CURRENCY_METADATA.IDR.symbol,
            image: CURRENCY_METADATA.IDR.image,
            main_price: formatRupiah(usdToIdr),
            sub_text: `1 IDR ≈ $${(1 / usdToIdr).toFixed(6)} USD`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.IDR, previousRates.IDR),
        },
        {
            id: "usd-eur",
            name: CURRENCY_METADATA.EUR.name,
            symbol: CURRENCY_METADATA.EUR.symbol,
            image: CURRENCY_METADATA.EUR.image,
            main_price: `€${latestRates.EUR.toFixed(2)} EUR`,
            sub_text: `1 EUR ≈ ${formatRupiah(usdToIdr / latestRates.EUR)} IDR`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.EUR, previousRates.EUR),
        },
        {
            id: "usd-gbp",
            name: CURRENCY_METADATA.GBP.name,
            symbol: CURRENCY_METADATA.GBP.symbol,
            image: CURRENCY_METADATA.GBP.image,
            main_price: `£${latestRates.GBP.toFixed(2)} GBP`,
            sub_text: `1 GBP ≈ ${formatRupiah(usdToIdr / latestRates.GBP)} IDR`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.GBP, previousRates.GBP),
        },
        {
            id: "usd-jpy",
            name: CURRENCY_METADATA.JPY.name,
            symbol: CURRENCY_METADATA.JPY.symbol,
            image: CURRENCY_METADATA.JPY.image,
            main_price: `¥${latestRates.JPY.toFixed(2)} JPY`,
            sub_text: `1 JPY ≈ Rp ${(usdToIdr / latestRates.JPY).toFixed(1).replace(".", ",")} IDR`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.JPY, previousRates.JPY),
        },
        {
            id: "usd-sgd",
            name: CURRENCY_METADATA.SGD.name,
            symbol: CURRENCY_METADATA.SGD.symbol,
            image: CURRENCY_METADATA.SGD.image,
            main_price: `S$ ${latestRates.SGD.toFixed(3)} SGD`,
            sub_text: `1 SGD ≈ ${formatRupiah(usdToIdr / latestRates.SGD)} IDR`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.SGD, previousRates.SGD),
        },
        {
            id: "usd-aud",
            name: CURRENCY_METADATA.AUD.name,
            symbol: CURRENCY_METADATA.AUD.symbol,
            image: CURRENCY_METADATA.AUD.image,
            main_price: `A$ ${latestRates.AUD.toFixed(3)} AUD`,
            sub_text: `1 AUD ≈ ${formatRupiah(usdToIdr / latestRates.AUD)} IDR`,
            price_change_percentage_24h: calculatePercentageChange(latestRates.AUD, previousRates.AUD),
        },
    ];

    return currencyItems;
}