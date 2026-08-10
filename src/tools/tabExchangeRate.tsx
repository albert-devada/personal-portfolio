"use client";

import { getApiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { MarketWidget } from "@/widget/marketWidget";
import { TabMarket, BaseMarketItem, MarketExchangeResponse } from "@/common/types/playgorund";
import { attachMarketIcons, ENERGY_METADATA, METALS_METADATA } from "@/common/constants/exchangeData";

export default function TabExchangeRate() {
    const [currencyItems, setCurrencyItems] = useState<BaseMarketItem[]>([]);
    const [energyItems, setEnergyItems] = useState<BaseMarketItem[]>([]);
    const [metalsItems, setMetalsItems] = useState<BaseMarketItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchAllMarketData() {
            const startTime = Date.now();
            const MIN_LOADING_TIME = 600;

            try {
                const exchangeRes: MarketExchangeResponse | null = await fetch(getApiUrl("/api/exchange"), { credentials: "include" }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
                
                if (isMounted) {
                    if (exchangeRes?.success && exchangeRes.data) {
                        const { currency, energy, metals } = exchangeRes.data;

                        if (Array.isArray(currency) && currency.length > 0) {
                            setCurrencyItems(currency);
                        } else {
                            setCurrencyItems([]);
                        }

                        if (Array.isArray(energy) && energy.length > 0) {
                            setEnergyItems(attachMarketIcons(energy, ENERGY_METADATA));
                        } else {
                            setEnergyItems([]);
                        }

                        if (Array.isArray(metals) && metals.length > 0) {
                            setMetalsItems(attachMarketIcons(metals, METALS_METADATA));
                        } else {
                            setMetalsItems([]);
                        }
                    } else {
                        setCurrencyItems([]);
                        setEnergyItems([]);
                        setMetalsItems([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching market playground data:", error);
                if (isMounted) {
                    setCurrencyItems([]);
                    setEnergyItems([]);
                    setMetalsItems([]);
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

    const menuExchangeRate: TabMarket[] = [
        {
            value: "currency",
            labelEn: "Currency",
            labelId: "Mata Uang",
            items: currencyItems,
            isLoading: isLoading || currencyItems.length === 0,
        },
        {
            value: "energy",
            labelEn: "Energy",
            labelId: "Energi",
            items: energyItems,
            isLoading: isLoading || energyItems.length === 0,
        },
        {
            value: "metals",
            labelEn: "Metals",
            labelId: "Logam",
            items: metalsItems,
            isLoading: isLoading || metalsItems.length === 0,
        },
    ];

    return (
        <MarketWidget
            tabs={menuExchangeRate}
            defaultValue="currency"
            infoTextEn="This real-time market data provides global currency exchange rates, energy benchmarks, and metal valuations."
            infoTextId="Data pasar real-time ini menyediakan nilai tukar mata uang global, tolok ukur energi, dan penilaian logam."
        />
    );
}