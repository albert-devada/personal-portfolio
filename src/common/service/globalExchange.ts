import { formatRupiah, fetchRawTimeSeriesData, calculatePercentageChange, getUsdToIdrRate } from "@/function";
import { CURRENCY_METADATA, ENERGY_METADATA } from "@/common/constants";
import type { BaseMarketItems, MarketChartResponse } from "@/common/types";

export async function fetchCurrencyData(): Promise<BaseMarketItems[]> {
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

    const currencyItems: BaseMarketItems[] = [
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

export async function fetchEnergyData(): Promise<BaseMarketItems[]> {
    const usdToIdr = await getUsdToIdrRate();
    const energyList = Object.values(ENERGY_METADATA);

    const requests = energyList.map(async (energy) => {
        try {
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${energy.ticker}`, {
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

            const energyItems: BaseMarketItems = {
                id: energy.id,
                name: energy.name,
                symbol: energy.symbol,
                main_price: `$ ${price.toFixed(2)}`,
                sub_text: `1 ${energy.unitLabel} ≈ ${formatRupiah(idrEquivalent)} IDR`,
                price_change_percentage_24h: percentChange,
            };

            return energyItems;

        } catch (error) {
            console.error("[ENERGY_SERVICE] Failed to fetch energy market data:", error);
            return null;
        }
    });

    const results = await Promise.all(requests);
    return results.filter((item): item is BaseMarketItems => item !== null);
}