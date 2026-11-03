"use client";

import { getApiUrl, AttachMarketIcons } from "@/function";
import { PlaygroundTabs } from "@/components/navigation";
import { useEffect, useState } from "react";
import { appToast } from "@/components/ui";
import { useLanguage } from "@/language";
import { CATEGORY_PLAYGROUND, ENERGY_METADATA } from "@/common/constants";
import type { GenericTabItems, BaseMarketItems, MarketResponseItems } from "@/common/types";

export function ExchangeRate() {
    const { lang } = useLanguage();
    const exchangeCategory = CATEGORY_PLAYGROUND.find((t) => t.id === "exchanges");
    const [currencyItems, setCurrencyItems] = useState<BaseMarketItems[]>([]);
    const [energyItems, setEnergyItems] = useState<BaseMarketItems[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchAllMarketData() {
            const startTime = Date.now();
            const MIN_LOADING_TIME = 600;

            try {
                const exchangeRes: MarketResponseItems | null = await fetch(getApiUrl("/api/exchange"), { credentials: "include" }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
                
                if (isMounted) {
                    if (exchangeRes?.success && exchangeRes.data) {
                        const { currency, energy } = exchangeRes.data;

                        if (Array.isArray(currency) && currency.length > 0) {
                            setCurrencyItems(currency);
                        } else {
                            setCurrencyItems([]);
                        }

                        if (Array.isArray(energy) && energy.length > 0) {
                            setEnergyItems(AttachMarketIcons(energy, ENERGY_METADATA));
                        } else {
                            setEnergyItems([]);
                        }
                        
                    } else {
                        setCurrencyItems([]);
                        setEnergyItems([]);
                    }
                }
            } catch {
                const systemErr = lang === "en" ? "An internal system error occurred. Try again later." : "Terjadi kesalahan sistem internal. Coba lagi nanti.";
                appToast.error(systemErr);
                if (isMounted) {
                    setCurrencyItems([]);
                    setEnergyItems([]);
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

    const MenuExchangeRate: GenericTabItems<BaseMarketItems>[] = [
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
    ];

    return (
        <PlaygroundTabs
            tabs={MenuExchangeRate}
            defaultValue="currency"
            descriptionEn={exchangeCategory?.descriptionEn || "Inspect visitor IP address, client network details, and geolocation data"}
            descriptionId={exchangeCategory?.descriptionId || "Periksa alamat IP pengunjung, rincian jaringan klien, dan data geolokasi"}
        />
    );
}