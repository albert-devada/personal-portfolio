"use client";

import { useState, useRef } from "react";
import { appToast } from "./sonnerProvider";
import { useLanguage, LanguageText, LanguageBlurFadeText } from "@/language";
import { BlurFade } from "@/components/transition";
import { Card, CardContent } from "@/components/base";
import { Typography } from "@/theme";
import { Activity, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { getApiUrl } from "@/function";
import { SearchCVETracker, NewsCVEItemCard } from "./exploitedCVE";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { PlaygroundCVEProps, ExploitedItems, CVEDataItems } from "@/common/types";

export const INITIAL_DISPLAY_COUNT = 5;
export const BLUR_FADE_DELAY = 0.04;

export function PlaygroundCVE({ items, type, isLoading, initialQuery, onInvestigate }: PlaygroundCVEProps) {
    const { lang } = useLanguage();
    const isVulnTab = type === "exploitedvulns";

    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
    const [searchQuery, setSearchQuery] = useState(initialQuery || "");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<(ExploitedItems | CVEDataItems)[]>([]);
    const [isSearchResult, setIsSearchResult] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const turnstileRef = useRef<TurnstileInstance | null>(null);

    const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
    if (initialQuery && initialQuery !== prevInitialQuery) {
        setPrevInitialQuery(initialQuery);
        setSearchQuery(initialQuery);
    }

    const [prevType, setPrevType] = useState(type);
    if (type !== prevType) {
        setPrevType(type);
        setVisibleCount(INITIAL_DISPLAY_COUNT);
        setSearchQuery(initialQuery || "");
        setSearchResults([]);
        setIsSearchResult(false);
        setIsInvalid(false);
        setTurnstileToken(null);
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanQuery = searchQuery.trim().toUpperCase();
        if (!cleanQuery) return;

        if (!/^CVE-\d{4}-\d{4,}$/i.test(cleanQuery)) {
            setIsInvalid(true);
            const formatErr = lang === "en" 
                ? "Invalid CVE ID format (e.g., CVE-2026-118527)" 
                : "Format CVE ID tidak valid (cth: CVE-2026-118527)";
            appToast.error(formatErr);
            return;
        }

        if (!turnstileToken) {
            const tokenErr = lang === "en" 
                ? "Please complete the security check." 
                : "Silakan selesaikan verifikasi keamanan.";
            appToast.error(tokenErr);
            return;
        }

        setIsSearching(true);
        setVisibleCount(INITIAL_DISPLAY_COUNT);

        try {
            const endpoint = isVulnTab
                ? getApiUrl(`/api/search?vulndata=${encodeURIComponent(cleanQuery)}`)
                : getApiUrl(`/api/search?cvedata=${encodeURIComponent(cleanQuery)}`);

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ turnstileToken }),
                credentials: "include",
            });

            const resData = await response.json().catch(() => null);

            if (!response.ok || !resData?.success) {
                const defaultErr = lang === "en" 
                    ? "Your request is invalid, Please try again." 
                    : "Permintaan Anda tidak valid, silakan coba lagi.";
                appToast.error(resData?.error || defaultErr);
                return;
            }

            const data = (Array.isArray(resData?.data) ? resData.data : []) as (ExploitedItems | CVEDataItems)[];
            setSearchResults(data);
            setIsSearchResult(true);

            if (data.length > 0) {
                const successMsg = lang === "en" 
                    ? `Found ${data.length} match for "${cleanQuery}".` 
                    : `Ditemukan ${data.length} hasil untuk "${cleanQuery}".`;
                appToast.success(successMsg);
            } else {
                const infoMsg = lang === "en" 
                    ? `No records found for "${cleanQuery}".` 
                    : `Tidak ditemukan data untuk "${cleanQuery}".`;
                appToast.info(infoMsg);
            }
        } catch {
            const systemErr = lang === "en" 
                ? "An internal error occurred. Please try again later." 
                : "Terjadi kesalahan internal. Silakan coba lagi nanti.";
            appToast.error(systemErr);
        } finally {
            setIsSearching(false);
            setTurnstileToken(null);
            turnstileRef.current?.reset();
        }
    };

    const handleResetToFeed = () => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearchResult(false);
        setIsInvalid(false);
        setVisibleCount(INITIAL_DISPLAY_COUNT);
    };

    const activeItems = isSearchResult ? searchResults : items;
    const displayedItems = activeItems.slice(0, visibleCount);

    return (
        <div className="space-y-6">
            <SearchCVETracker
                isVulnTab={isVulnTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearching={isSearching}
                isSearchResult={isSearchResult}
                isInvalid={isInvalid}
                setIsInvalid={setIsInvalid}
                onSearch={handleSearch}
                onReset={handleResetToFeed}
                setTurnstileToken={setTurnstileToken}
                turnstileRef={turnstileRef}
            />

            <BlurFade delay={BLUR_FADE_DELAY * 1.5} inView>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 2}
                                enText={isSearchResult ? "SEARCH RESULTS" : isVulnTab ? "OFFICIAL CISA.GOV CATALOG" : "LIVE 24-HOUR CVE FEED"}
                                idText={isSearchResult ? "HASIL PENCARIAN" : isVulnTab ? "KATALOG RESMI CISA.GOV" : "FEED CVE LIVE 24 JAM"}
                                className="text-xs font-bold text-primary uppercase tracking-widest block"
                            />
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 2.5}
                                enText={
                                    isSearchResult
                                        ? `Found matching vulnerabilities for "${searchQuery}".`
                                        : isVulnTab
                                            ? `Cataloging ${activeItems.length} vulnerabilities actively exploited in the wild.`
                                            : `Top ${activeItems.length} vulnerabilities published in recent updates.`
                                }
                                idText={
                                    isSearchResult
                                        ? `Ditemukan kerentanan yang sesuai untuk "${searchQuery}".`
                                        : isVulnTab
                                            ? `Mencatat ${activeItems.length} kerentanan yang sedang aktif dieksploitasi secara nyata.`
                                            : `${activeItems.length} kerentanan teratas yang dipublikasikan dalam pembaruan terkini.`
                                }
                                className="text-sm text-slate-600 dark:text-slate-400 block font-sans mt-0.5"
                            />
                        </div>
                    </div>
                </div>
            </BlurFade>
            {isLoading ? (
                <div className="space-y-4">
                    <Typography.P className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground w-full">
                        <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                        <LanguageBlurFadeText 
                            enText="Synchronizing security intelligence feed..." 
                            idText="Menyingkronkan data intelijen keamanan..." 
                            className="animate-pulse w-fit" 
                        />
                    </Typography.P>
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardContent className="p-4 sm:p-5 space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-border/40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-muted rounded" />
                                                <div className="h-3 w-48 bg-muted rounded" />
                                            </div>
                                        </div>
                                        <div className="h-6 w-24 bg-muted rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-muted rounded" />
                                        <div className="h-4 w-3/4 bg-muted rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : activeItems.length === 0 ? (
                <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/60 bg-card/20 min-h-48">
                        <div className="p-3 rounded-full mb-3 bg-primary/10 text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 2.5}
                            enText={isSearchResult ? "No Vulnerabilities Match Search" : "No Vulnerability Records Found"}
                            idText={isSearchResult ? "Tidak Ada Kerentanan Cocok Dengan Pencarian" : "Tidak Ada Rekaman Kerentanan Ditemukan"}
                            className="text-sm font-semibold text-foreground block"
                        />
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 3}
                            enText={
                                isSearchResult
                                    ? "Try verifying the CVE ID or resetting back to the active feed."
                                    : "Check back later or verify that feed synchronizers are active."
                            }
                            idText={
                                isSearchResult
                                    ? "Coba periksa kembali ID CVE atau kembali ke feed aktif."
                                    : "Periksa kembali nanti atau pastikan sinkronisasi feed sedang aktif."
                            }
                            className="text-xs text-muted-foreground max-w-sm mt-1 block"
                        />
                    </div>
                </BlurFade>
            ) : (
                <div className="space-y-6">
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.75 sm:before:left-3.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-primary/60 before:via-neutral-300 dark:before:via-neutral-800 before:to-neutral-200/20 dark:before:to-neutral-900/20">
                        {displayedItems.map((item, index) => (
                            <NewsCVEItemCard 
                                key={("cveID" in item ? item.cveID : item.cveId) || index} 
                                item={item} 
                                index={index} 
                                onInvestigate={onInvestigate}
                            />
                        ))}
                    </div>

                    {activeItems.length > INITIAL_DISPLAY_COUNT && (
                        <div className="flex justify-center pt-2">
                            {visibleCount < activeItems.length ? (
                                <button 
                                    type="button"
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-mono font-medium transition-all cursor-pointer shadow-xs">
                                    <span>
                                        <LanguageText 
                                            enText={`Load More Records (${activeItems.length - visibleCount} remaining)`} 
                                            idText={`Muat Lebih Banyak (${activeItems.length - visibleCount} tersisa)`} 
                                        />
                                    </span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={() => setVisibleCount(INITIAL_DISPLAY_COUNT)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground border border-black/5 dark:border-white/10 text-xs font-mono font-medium transition-all cursor-pointer">
                                    <span>
                                        <LanguageText enText="Collapse List" idText="Ciutkan Daftar" />
                                    </span>
                                    <ChevronUp className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
