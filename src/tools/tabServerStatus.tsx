"use client";

import { getApiUrl } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import {
    Server,
    Database,
    Sparkles,
    Activity,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    Cpu,
    Radio
} from "lucide-react";
import { appToast } from "@/components/sonnerProvider";
import { Card, CardContent } from "@/components/containerCard";
import { BlurFade } from "@/components/blurFade";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";
import { HealthResponseData, HealthApiResponse } from "@/common/types/playgorund";

const BLUR_FADE_DELAY = 0.04;

const formatPingTime = (date: Date | null, currentLang: string) => {
    if (!date) return "N/A";
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    if (currentLang === "en") {
        const datePart = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
        const formattedHours = String(hours % 12 || 12).padStart(2, "0");
        return `${datePart} at ${formattedHours}:${minutes}:${seconds} ${period}`;
    } else {
        const datePart = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
        const formattedHours = String(hours).padStart(2, "0");
        return `${datePart} pada ${formattedHours}.${minutes}.${seconds} WIB`;
    }
};

export default function TabServerStatus() {
    const { lang } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [healthData, setHealthData] = useState<HealthResponseData | null>(null);
    const [lastPing, setLastPing] = useState<Date | null>(null);

    const fetchStatus = useCallback(async (isManualRefresh = false) => {
        setIsLoading(true);
        
        try {
            const response = await fetch(getApiUrl("/api/health"), {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
                credentials: "include",
            });

            const resData: HealthApiResponse | null = await response.json().catch(() => null);

            if (resData && resData.data) {
                setHealthData(resData.data);
                setLastPing(new Date());

                if (isManualRefresh) {
                    const successMsg = lang === "en" ? "Server status updated successfully." : "Status server berhasil diperbarui.";
                    appToast.success(successMsg);
                }
            } else {
                if (isManualRefresh) {
                    const err = resData?.error || (lang === "en" ? "Failed to refresh server status." : "Gagal memperbarui status server.");
                    appToast.error(err);
                }
            }
        } catch {
            if (isManualRefresh) {
                const connErr = lang === "en" ? "Error connecting to health check endpoint." : "Gagal terhubung ke endpoint status server.";
                appToast.error(connErr);
            }
        } finally {
            setIsLoading(false);
        }
    }, [lang]);

    useEffect(() => {
        let isMounted = true;

        const loadInitialStatus = async () => {
            try {
                const response = await fetch("/api/health", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });
                const resData: HealthApiResponse | null = await response.json().catch(() => null);
                if (!isMounted) return;

                if (resData && resData.data) {
                    setHealthData(resData.data);
                    setLastPing(new Date());
                }
            } catch {

            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    const isSystemHealthy = healthData?.status === "healthy";
    const serverService = healthData?.services?.server;
    const databaseService = healthData?.services?.database;
    const aiService = healthData?.services?.ai_model;

    return (
        <div className="space-y-6">
            <BlurFade delay={BLUR_FADE_DELAY} inView>
                <Card className="overflow-hidden border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xs">
                    <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <LanguageBlurFadeText
                                        delay={BLUR_FADE_DELAY * 1.5}
                                        enText="INFRASTRUCTURE"
                                        idText="INFRASTRUKTUR"
                                        className="text-xs font-bold text-primary uppercase tracking-widest block"
                                    />
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                                    </span>
                                </div>
                                <LanguageBlurFadeText
                                    delay={BLUR_FADE_DELAY * 2}
                                    enText={isSystemHealthy ? "All core services are operational." : "Some services may be degraded or slow."}
                                    idText={isSystemHealthy ? "Semua layanan utama normal." : "Beberapa layanan mungkin bermasalah."}
                                    className="text-sm text-slate-600 dark:text-slate-400 block font-sans mt-0.5"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5 dark:border-white/10 shrink-0">
                            <div className="text-left sm:text-right">
                                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase">
                                    <Clock className="h-3 w-3" />
                                    <LanguageText enText="Last Ping" idText="Ping Terakhir" />
                                </div>
                                <span className="text-xs font-mono font-medium text-foreground block">
                                    {formatPingTime(lastPing, lang)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => fetchStatus(true)}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium font-mono hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs">
                                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                    <Card className="h-full transition-transform duration-300 hover:scale-[1.015] border-black/5 dark:border-white/10">
                        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Server className="h-5 w-5" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <LanguageText enText="Healthy" idText="Sehat" />
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-foreground font-sans">
                                        <LanguageText enText="Application Server" idText="Server Aplikasi" />
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        <LanguageText
                                            enText="Secure, scalable infrastructure for reliable application hosting."
                                            idText="Infrastruktur aman dan skalabel untuk menjalankan aplikasi."
                                        />
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                                <span className="text-muted-foreground">
                                    <LanguageText enText="Response Time" idText="Waktu Respon" />
                                </span>
                                <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-black/5 dark:border-white/10">
                                    {isLoading ? "..." : (serverService?.latency || "0ms")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 2.5} inView>
                    <Card className="h-full transition-transform duration-300 hover:scale-[1.015] border-black/5 dark:border-white/10">
                        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    {databaseService?.status === "healthy" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <LanguageText enText="Healthy" idText="Sehat" />
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                            <XCircle className="h-3.5 w-3.5" />
                                            <LanguageText enText="Unhealthy" idText="Bermasalah" />
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-foreground font-sans">
                                        <LanguageText enText="Database Server" idText="Server Basis Data" />
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        <LanguageText
                                            enText="Secure, scalable infrastructure for reliable data storage."
                                            idText="Infrastruktur aman dan skalabel untuk penyimpanan data."
                                        />
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                                <span className="text-muted-foreground">
                                    <LanguageText enText="Response Time" idText="Waktu Respon" />
                                </span>
                                <span className="font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-black/5 dark:border-white/10">
                                    {isLoading ? "..." : (databaseService?.latency || "0ms")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
                    <Card className="h-full transition-transform duration-300 hover:scale-[1.015] border-black/5 dark:border-white/10">
                        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <LanguageText enText="Upcoming" idText="Akan Hadir" />
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-base font-bold text-foreground font-sans">
                                            <LanguageText enText="AI Model Server" idText="Server Model AI" />
                                        </h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        <LanguageText
                                            enText="This feature is actively being developed and will be available soon."
                                            idText="Fitur ini sedang aktif dikembangkan dan akan segera tersedia."
                                        />
                                    </p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                                <span className="text-muted-foreground">
                                    <LanguageText enText="Model Status" idText="Status Model" />
                                </span>
                                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                    {isLoading ? "..." : (aiService?.latency || "0ms")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY * 3.5} inView>
                <Card className="border-black/5 dark:border-white/10">
                    <CardContent className="p-4 sm:p-5 space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 4}
                                enText="Server Architecture Details"
                                idText="Detail Arsitektur Server"
                                className="text-sm font-semibold"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Cpu className="h-3.5 w-3.5 text-primary" />
                                    <LanguageText enText="Application (Vercel)" idText="Aplikasi (Vercel)" />
                                </div>
                                <p className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageText 
                                        enText="Hosted on Vercel's global edge network, delivering fast, scalable serverless application execution." 
                                        idText="Dihosting di jaringan edge global Vercel, menyediakan eksekusi aplikasi serverless yang cepat dan skalabel." 
                                    />
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Database className="h-3.5 w-3.5 text-primary" />
                                    <LanguageText enText="Database (Supabase)" idText="Basis Data (Supabase)" />
                                </div>
                                <p className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageText 
                                        enText="Powered by Supabase cloud database, providing reliable data storage and real-time connectivity." 
                                        idText="Didukung oleh basis data cloud Supabase, menyediakan penyimpanan data yang andal dan real-time." 
                                    />
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Radio className="h-3.5 w-3.5 text-primary" />
                                    <LanguageText enText="AI Model Chatbot" idText="Chatbot Model AI" />
                                </div>
                                <p className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageText 
                                        enText="Integration with AI models (LLM & Vision) is actively being developed and will be available in updates." 
                                        idText="Integrasi dengan model AI (LLM & Vision) sedang aktif dikembangkan dan akan segera tersedia pada pembaruan mendatang." 
                                    />
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
