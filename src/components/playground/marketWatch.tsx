"use client";

import { getApiUrl } from "@/function";
import { PlaygroundTabs } from "@/components/navigation";
import { useEffect, useState } from "react";
import { appToast } from "@/components/ui";
import { useLanguage } from "@/language";
import { CATEGORY_PLAYGROUND } from "@/common/constants";
import type { GenericTabItems, BaseMarketItems, MarketResponseItems } from "@/common/types";

export function MarketWatch() {
    const { lang } = useLanguage();
    const marketCategory = CATEGORY_PLAYGROUND.find((t) => t.id === "market");
    const [cryptoItems, setCryptoItems] = useState<BaseMarketItems[]>([]);
    const [stocksItems, setStocksItems] = useState<BaseMarketItems[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchAllMarketData() {
            const startTime = Date.now();
            const MIN_LOADING_TIME = 600;

            try {
                const marketWatchRes: MarketResponseItems | null = await fetch(getApiUrl("/api/market"), { credentials: "include" }).then((res) => (res.ok ? res.json() : null)).catch(() => null);

                if (isMounted) {
                    if (marketWatchRes?.success && marketWatchRes.data) {
                        const { crypto, stocks } = marketWatchRes.data;

                        if (Array.isArray(crypto) && crypto.length > 0) {
                            setCryptoItems(crypto);
                        } else {
                            setCryptoItems([]);
                        }

                        if (Array.isArray(stocks) && stocks.length > 0) {
                            setStocksItems(stocks);
                        } else {
                            setStocksItems([]);
                        }

                    } else {
                        setCryptoItems([]);
                        setStocksItems([]);
                    }
                }
            } catch {
                const systemErr = lang === "en" ? "An internal system error occurred. Try again later." : "Terjadi kesalahan sistem internal. Coba lagi nanti.";
                appToast.error(systemErr);
                if (isMounted) {
                    setCryptoItems([]); 
                    setStocksItems([]);
                }
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                setTimeout(() => {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }, remainingTime);
            }
        }

        fetchAllMarketData();

        return () => {
            isMounted = false;
        };
    }, [lang]);

    const MenuMarketWatch: GenericTabItems<BaseMarketItems>[] = [
        {
            value: "crypto",
            labelEn: "Cryptocurrency",
            labelId: "Mata Uang Kripto",
            items: cryptoItems,
            isLoading: isLoading || cryptoItems.length === 0,
        },
        {
            value: "stocks",
            labelEn: "Stocks US",
            labelId: "Saham US",
            items: stocksItems,
            isLoading: isLoading || stocksItems.length === 0,
        },
    ];

    return (
        <PlaygroundTabs
            tabs={MenuMarketWatch}
            defaultValue="crypto"
            descriptionEn={marketCategory?.descriptionEn || "Real-time tracking and market data for Cryptocurrencies and US Stocks"}
            descriptionId={marketCategory?.descriptionId || "Pemantauan waktu nyata untuk pasar Cryptocurrency dan Saham AS"}
        />
    );
}