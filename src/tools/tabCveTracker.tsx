"use client";

import React, { useState, useRef, useEffect, useCallback, startTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { 
    Bug, 
    Search, 
    ExternalLink, 
    ChevronDown, 
    ChevronUp, 
    AlertTriangle,
    Activity,
    FileText,
    RefreshCw,
    Shield,
    Tag
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { appToast } from "@/components/sonnerProvider";
import { CVEDataItem } from "@/common/types/playgorund";
import { Card, CardContent } from "@/components/containerCard";
import { BlurFade } from "@/components/blurFade";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";

const INITIAL_DISPLAY_COUNT = 5;
const BLUR_FADE_DELAY = 0.04;
const CVE_ID_REGEX = /^CVE-\d{4}-\d{4,}$/i;

const formatCveDate = (dateStr?: string, currentLang: string = "en") => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    if (currentLang === "en") {
        const datePart = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);

        const formattedHours = String(hours % 12 || 12).padStart(2, "0");
        return `${datePart} at ${formattedHours}:${minutes}${period}`;
    } else {
        const datePart = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);

        const formattedHours = String(hours).padStart(2, "0");
        return `${datePart} pada ${formattedHours}.${minutes}${period}`;
    }
};

export default function TabCveTracker() {
    const { lang } = useLanguage();
    const searchParams = useSearchParams();
    
    const langRef = useRef(lang);
    useEffect(() => {
        langRef.current = lang;
    }, [lang]);

    const [cveQuery, setCveQuery] = useState(() => {
        const cveFromUrl = searchParams.get("cve");
        return cveFromUrl && CVE_ID_REGEX.test(cveFromUrl) ? cveFromUrl.toUpperCase() : "";
    });

    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFeedLoading, setIsFeedLoading] = useState(true);
    const [isInvalid, setIsInvalid] = useState(false);
    const [results, setResults] = useState<CVEDataItem[]>([]);
    const [isSearchResult, setIsSearchResult] = useState(false);
    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
    const turnstileRef = useRef<TurnstileInstance | null>(null);

    useEffect(() => {
        const cveFromUrl = searchParams.get("cve");
        if (cveFromUrl && CVE_ID_REGEX.test(cveFromUrl)) {
            const upper = cveFromUrl.toUpperCase();
            startTransition(() => {
                setCveQuery(upper);
            });
        }
    }, [searchParams]);

    const fetchLatestFeed = useCallback(async () => {
        setIsFeedLoading(true);
        try {
            const response = await fetch(getApiUrl("/api/cvedata"), {
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: "include",
            });

            const resData = await response.json().catch(() => null);

            if (response.ok && resData?.success && Array.isArray(resData?.data)) {
                setResults(resData.data as CVEDataItem[]);
                setIsSearchResult(false);
            } else {
                const err = resData?.error || (langRef.current === "en" ? "Failed to load recent CVE feed." : "Gagal memuat feed CVE terbaru.");
                appToast.error(err);
            }
        } catch {
            appToast.error(langRef.current === "en" ? "Error connecting to CVE feed." : "Gagal terhubung ke feed CVE.");
        } finally {
            setIsFeedLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const response = await fetch(getApiUrl("/api/cvedata"), {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    credentials: "include",
                });

                const resData = await response.json().catch(() => null);

                if (!isMounted) return;

                if (response.ok && resData?.success && Array.isArray(resData?.data)) {
                    setResults(resData.data as CVEDataItem[]);
                    setIsSearchResult(false);
                } else {
                    const err = resData?.error || (langRef.current === "en" ? "Failed to load recent CVE feed." : "Gagal memuat feed CVE terbaru.");
                    appToast.error(err);
                }
            } catch {
                if (isMounted) {
                    appToast.error(langRef.current === "en" ? "Error connecting to CVE feed." : "Gagal terhubung ke feed CVE.");
                }
            } finally {
                if (isMounted) {
                    setIsFeedLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearchCve = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = cveQuery.trim();

        if (!cleanId) return;

        if (!CVE_ID_REGEX.test(cleanId)) {
            setIsInvalid(true);
            const alertMsg = lang === "en" ? "Invalid format (Example: CVE-2026-70368)" : "Format tidak valid (Contoh: CVE-2026-70368)";
            appToast.error(alertMsg);
            return;
        }

        if (!turnstileToken) {
            const tokenErr = lang === "en" ? "Please complete the security check." : "Silakan selesaikan verifikasi keamanan.";
            appToast.error(tokenErr);
            return;
        }

        setIsInvalid(false);
        setIsLoading(true);
        setVisibleCount(INITIAL_DISPLAY_COUNT);

        try {
            const response = await fetch(getApiUrl("/api/cvesearch"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cveId: cleanId, turnstileToken }),
                credentials: "include",
            });

            const resData = await response.json().catch(() => null);

            if (!response.ok || !resData?.success) {
                const defaultErr = lang === "en" ? "Your request is invalid, Please try again." : "Permintaan Anda tidak valid, silakan coba lagi.";
                appToast.error(resData?.error || defaultErr);
                return;
            }

            const data = (Array.isArray(resData?.data) ? resData.data : []) as CVEDataItem[];
            setResults(data);
            setIsSearchResult(true);

            if (data.length > 0) {
                const successMsg = lang === "en" ? `Found ${data.length} matches for "${cleanId}".` : `Ditemukan ${data.length} hasil untuk "${cleanId}".`;
                appToast.success(successMsg);
            } else {
                const infoMsg = lang === "en" ? `No records found for "${cleanId}".` : `Tidak ditemukan untuk "${cleanId}".`;
                appToast.info(infoMsg);
            }

        } catch {
            const systemErr = lang === "en" ? "An internal error occurred. Please try again later." : "Terjadi kesalahan internal. Silakan coba lagi nanti.";
            appToast.error(systemErr);
        } finally {
            setIsLoading(false);
            setTurnstileToken(null);
            turnstileRef.current?.reset();
        }
    };

    const handleResetToFeed = () => {
        setCveQuery("");
        setIsInvalid(false);
        fetchLatestFeed();
    };

    const getSeverityBadgeClass = (severity: string) => {
        const upper = severity?.toUpperCase() || "";
        if (upper === "CRITICAL" || upper === "HIGH") {
            return "bg-rose-500/10 text-rose-500 border-rose-500/20";
        }
        if (upper === "MEDIUM") {
            return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
        if (upper === "LOW") {
            return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        }
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    };

    const sortedCves = [...results].sort((a, b) => new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime());
    const displayedCves = sortedCves.slice(0, visibleCount);

    return (
        <div className="space-y-6">
            <BlurFade delay={BLUR_FADE_DELAY} inView>
                <Card className="overflow-hidden">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Bug className="h-4 w-4" />
                                <LanguageBlurFadeText delay={BLUR_FADE_DELAY * 1.5}
                                    enText="CVE Vulnerability Intelligence Search"
                                    idText="Pencarian Intelijen Kerentanan CVE"
                                    className="text-sm font-semibold"
                                />
                            </div>
                            {isSearchResult && (
                                <button type="button"
                                    onClick={handleResetToFeed}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                    <RefreshCw className="h-3 w-3" />
                                    <LanguageText enText="Reset to Feed" idText="Kembali ke Feed" />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSearchCve} className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        placeholder={
                                            lang === "en"
                                                ? "Enter CVE ID (e.g., CVE-2026-70368)"
                                                : "Masukkan ID CVE (cth: CVE-2026-70368)"
                                        }
                                        value={cveQuery}
                                        onChange={(e) => {
                                            setCveQuery(e.target.value);
                                            if (isInvalid) setIsInvalid(false);
                                        }}
                                        className={`w-full h-10 rounded-lg border bg-background/50 pl-10 pr-4 text-sm font-mono focus-visible:outline-hidden focus-visible:ring-1 ${
                                            isInvalid ? "border-rose-500 focus-visible:ring-rose-500 text-rose-600 dark:text-rose-400" : "border-black/10 dark:border-white/10 focus-visible:ring-primary text-foreground"
                                        }`}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !cveQuery.trim()}
                                    className="h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0">
                                    {isLoading ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            <span>
                                                <LanguageText enText="Searching..." idText="Mencari..." />
                                            </span>
                                        </>
                                    ) : (
                                        <span>
                                            <LanguageText enText="Search CVE ID" idText="Temukan CVE ID" />
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="py-4 w-full max-w-full flex flex-col items-center justify-center gap-2 overflow-hidden">
                                <p className="text-sm text-muted-foreground font-medium text-center">
                                    <LanguageText enText="Complete the security check for search:" idText="Selesaikan verifikasi keamanan untuk pencarian:" />
                                </p>
                                <div className="w-full flex items-center justify-center min-h-16.25 overflow-hidden">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                        onExpire={() => setTurnstileToken(null)}
                                        onError={() => setTurnstileToken(null)}
                                        options={{ theme: "auto", size: "normal", responseField: false }}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 2.5}
                                enText={isSearchResult ? "SEARCH RESULTS" : "LIVE 24-HOUR CVE FEED"}
                                idText={isSearchResult ? "HASIL PENCARIAN" : "FEED CVE LIVE 24 JAM"}
                                className="text-xs font-bold text-primary uppercase tracking-widest block"
                            />
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 3}
                                enText={isSearchResult ? `Found matching vulnerabilities for "${cveQuery}".` : `Top ${sortedCves.length} vulnerabilities published in the last 24 hours.`}
                                idText={isSearchResult ? `Ditemukan kerentanan yang sesuai untuk "${cveQuery}".` : `${sortedCves.length} kerentanan teratas yang dipublikasikan dalam 24 jam terakhir.`}
                                className="text-sm text-slate-600 dark:text-slate-400 block font-sans mt-0.5"
                            />
                        </div>
                    </div>
                </div>
            </BlurFade>
            {isFeedLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground font-mono text-sm">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <LanguageText enText="Synchronizing CVE Feed..." idText="Menyingkronkan Feed CVE..." />
                </div>
            ) : displayedCves.length > 0 ? (
                <div className="space-y-6">
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.75 sm:before:left-3.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-primary/60 before:via-neutral-300 dark:before:via-neutral-800 before:to-neutral-200/20 dark:before:to-neutral-900/20">
                        {displayedCves.map((cve, index) => {
                            const dynamicDelay = BLUR_FADE_DELAY * 3 + Math.min(index * 0.05, 0.25);

                            return (
                                <BlurFade key={cve.cveId || index} delay={dynamicDelay} inView>
                                    <div className="relative space-y-2">
                                        <span className="absolute -left-4.5 sm:-left-6 top-1.75 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-background z-20">
                                            <span className="absolute inset-0 rounded-full border-2 border-primary shadow-[0_0_8px_rgba(59,130,246,0.4)] animate-pulse" />
                                        </span>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/40">
                                            <LanguageText 
                                                enText={`Published: ${formatCveDate(cve.published, "en")}`} 
                                                idText={`Diterbitkan: ${formatCveDate(cve.published, "id")}`} 
                                            />
                                        </div>
                                        <Card className="transition-transform duration-300 hover:scale-[1.005]">
                                            <CardContent className="p-4 sm:p-5 space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-muted/60 flex items-center justify-center p-1">
                                                            <Shield className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <span className="text-base font-bold text-foreground block font-mono">
                                                                {cve.cveId}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground font-mono block">
                                                                <LanguageText enText="Vendor: " idText="Provider: " />
                                                                <span className="text-foreground font-medium">{cve.vendor || "Unknown"}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                                                        {cve.status && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium font-mono bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-sm border border-zinc-500/20">
                                                                <Tag className="h-3 w-3" /> {cve.status}
                                                            </span>
                                                        )}
                                                        {cve.severity && (
                                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-sm border ${getSeverityBadgeClass(cve.severity)}`}>
                                                                <AlertTriangle className="h-3 w-3" /> {cve.severity} ~ {cve.score !== null && cve.score !== undefined ? cve.score.toFixed(1) : "N/A"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                                                    <p>{cve.description || (lang === "en" ? "No description available." : "Tidak ada deskripsi yang tersedia.")}</p>
                                                </div>
                                                {cve.reference && (
                                                    <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                                            <LanguageText enText="Official Security Reference" idText="Referensi Keamanan Resmi" />
                                                        </span>
                                                        <a
                                                            href={cve.reference}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-semibold font-mono px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer shadow-xs">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            <span>
                                                                <LanguageText enText="View Security Advisory" idText="Lihat Penasihat Keamanan" />
                                                            </span>
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </BlurFade>
                            );
                        })}
                    </div>
                    {sortedCves.length > INITIAL_DISPLAY_COUNT && (
                        <div className="flex justify-center pt-2">
                            {visibleCount < sortedCves.length ? (
                                <button type="button"
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-mono font-medium transition-all cursor-pointer shadow-xs">
                                    <span>
                                        <LanguageText 
                                            enText={`Load More Vulnerabilities (${sortedCves.length - visibleCount} remaining)`} 
                                            idText={`Muat Lebih Banyak Kerentanan (tersisa ${sortedCves.length - visibleCount})`} 
                                        />
                                    </span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                            ) : (
                                <button type="button"
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
            ) : (
                <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-card/20 min-h-48">
                        <div className="p-3 rounded-full mb-3 bg-primary/5 text-primary">
                            <Bug className="h-6 w-6" />
                        </div>
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 2.5}
                            enText="No Vulnerability Records Found"
                            idText="Tidak Ada Rekaman Kerentanan Ditemukan"
                            className="text-sm font-semibold text-foreground block"
                        />
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 3}
                            enText="Try resetting filters or typing a specific valid CVE ID in the search bar above."
                            idText="Coba atur ulang filter atau masukkan ID CVE spesifik yang valid pada kolom pencarian di atas."
                            className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1 block"
                        />
                    </div>
                </BlurFade>
            )}
        </div>
    );
}