import { BaseMarketItem } from "@/common/types/playgorund";
import { getUsdToIdrRate } from "./currencyService";

interface CryptoMarketCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
}

export async function fetchCryptoData(): Promise<BaseMarketItem[]> {
    const apiUrl = `${process.env.CRYPTO_API_URL}/coins/markets?vs_currency=usd&per_page=6&page=1` || "YOUR_API_URL";

    try {
        const response = await fetch(apiUrl,
            {
                headers: { Accept: "application/json" },
                next: { revalidate: 7200 },
            }
        );

        if (!response.ok) {
            console.error(`[CRYPTO_SERVICE] API error: ${response.status}`);
            return [];
        }

        const data: CryptoMarketCoin[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.error(`[CRYPTO_SERVICE] Doesn't have an array 'coins' in the response.`);
            return [];
        }

        const usdToIdr = await getUsdToIdrRate();

        const cryptoItems: BaseMarketItem[] = data.map((coin) => {
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
                name: coin.name,
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