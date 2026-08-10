"use client";

import { getApiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { MarketWidget } from "@/widget/marketWidget";
import { TabMarket, BaseMarketItem, MarketWatchResponse, NewsArticleItem } from "@/common/types/playgorund";

export default function TabMarketWatch() {
    const [cryptoItems, setCryptoItems] = useState<BaseMarketItem[]>([]);
    const [stocksItems, setStocksItems] = useState<BaseMarketItem[]>([]);
    const [newsItems, setMarketNewsItems] = useState<NewsArticleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchAllMarketData() {
            const startTime = Date.now();
            const MIN_LOADING_TIME = 600;

            try {
                const marketWatchRes: MarketWatchResponse | null = await fetch(getApiUrl("/api/market"), { credentials: "include" }).then((res) => (res.ok ? res.json() : null)).catch(() => null);

                if (isMounted) {
                    if (marketWatchRes?.success && marketWatchRes.data) {
                        const { crypto, stocks, sentiment } = marketWatchRes.data;

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

                        if (Array.isArray(sentiment) && sentiment.length > 0) {
                            setMarketNewsItems(sentiment);
                        } else {
                            setMarketNewsItems([]);
                        }
                    } else {
                        setCryptoItems([]);
                        setStocksItems([]);
                        setMarketNewsItems([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching market playground data:", error);
                if (isMounted) {
                    setCryptoItems([]); 
                    setStocksItems([]);
                    setMarketNewsItems([]);
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
    }, []);

    const menuMarketWatch: TabMarket[] = [
        {
            value: "crypto",
            labelEn: "Cryptocurrency",
            labelId: "Mata Uang Kripto",
            type: "grid",
            items: cryptoItems,
            isLoading: isLoading || cryptoItems.length === 0,
        },
        {
            value: "stocks",
            labelEn: "Stocks US",
            labelId: "Saham US",
            type: "grid",
            items: stocksItems,
            isLoading: isLoading || stocksItems.length === 0,
        },
        {
            value: "sentiment",
            labelEn: "Market Sentiment",
            labelId: "Sentimen Pasar",
            type: "news",
            newsItems: newsItems,
            isLoading: isLoading || newsItems.length === 0,
        },
    ];

    return (
        <MarketWidget
            tabs={menuMarketWatch}
            defaultValue="crypto"
            infoTextEn="This real-time market data provides cryptocurrency prices, US stock valuations, and market sentiment insights."
            infoTextId="Data pasar real-time ini menyediakan harga mata uang kripto, valuasi saham US, dan wawasan sentimen pasar."
        />
    );
}