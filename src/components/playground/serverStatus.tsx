"use client";

import { getApiUrl } from "@/function";
import { formatDateTime } from "@/utils";
import { CATEGORY_PLAYGROUND } from "@/common/constants";
import { useState, useEffect, useCallback } from "react";
import { BlurFade } from "@/components/transition";
import { Card, CardContent, Button } from "@/components/base";
import { appToast } from "@/components/ui";
import { Typography } from "@/theme";
import { HealthResponseData, HealthResponse } from "@/common/types";
import { useLanguage, LanguageText, LanguageBlurFadeText } from "@/language";
import {
    Server,
    Database,
    Bot,
    Activity,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Cpu,
    Radio,
    Code2
} from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export function ServerStatus() {
    const { lang } = useLanguage();
    const serverCategory= CATEGORY_PLAYGROUND.find((t) => t.id === "server");
    const [isLoading, setIsLoading] = useState(true);
    const [healthData, setHealthData] = useState<HealthResponseData | null>(null);
    const [lastPing, setLastPing] = useState<Date | null>(null);

    const fetchStatus = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setIsLoading(true);
        }

        try {
            const [response] = await Promise.all([
                fetch(getApiUrl("/api/health"), {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                    credentials: "include",
                }),
                new Promise((resolve) => setTimeout(resolve, 500)),
            ]);

            const resData: HealthResponse | null = await response.json().catch(() => null);

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
        const timer = setTimeout(() => {
            void fetchStatus(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchStatus]);

    const isSystemHealthy = healthData?.status === "healthy";
    const serverService = healthData?.services?.server;
    const databaseService = healthData?.services?.database;
    const aiService = healthData?.services?.ai_model;

    return (
        <div className="space-y-4">
            <BlurFade delay={BLUR_FADE_DELAY} inView>
                <Card className="overflow-hidden border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xs transition-transform duration-300 hover:scale-[1.005]">
                    <CardContent className="p-4 sm:p-5 flex flex-col gap-3.5 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 min-w-0 w-full">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Typography.CardTitle className="min-w-0 flex-1">
                                        <LanguageBlurFadeText
                                            delay={BLUR_FADE_DELAY * 1.5}
                                            enText="INFRASTRUCTURE"
                                            idText="INFRASTRUKTUR"
                                            className="text-xs font-bold text-primary uppercase tracking-widest block"
                                        />
                                    </Typography.CardTitle>
                                    {isSystemHealthy ? (
                                        <Typography.MonoText className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
                                        </Typography.MonoText>
                                    ) : (
                                        <Typography.MonoText className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />DEGRADED
                                        </Typography.MonoText>
                                    )}
                                </div>
                                <Typography.Subtitle>
                                    <LanguageBlurFadeText
                                        delay={BLUR_FADE_DELAY * 2}
                                        enText={isSystemHealthy ? "All core services are operational." : "Some services may be degraded or slow."}
                                        idText={isSystemHealthy ? "Semua layanan utama normal." : "Beberapa layanan mungkin bermasalah."}
                                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 block font-sans mt-0.5"
                                    />
                                </Typography.Subtitle>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 w-full border-t border-black/5 dark:border-white/10 pt-3 sm:pt-3.5">
                            <Typography.MonoText className="text-left">
                                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase">
                                    <Clock className="h-3 w-3" />
                                    <LanguageText enText="Last Ping" idText="Ping Terakhir" />
                                </div>
                                <span className="text-xs font-mono font-medium text-foreground block">
                                    {formatDateTime(lastPing, lang)}
                                </span>
                            </Typography.MonoText>
                            <Typography.Text>
                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    onClick={() => fetchStatus(true)}
                                    disabled={isLoading}
                                    suppressHydrationWarning
                                    className="h-8.5 gap-2 px-3.5 rounded-lg text-xs font-mono font-medium shrink-0 cursor-pointer shadow-xs">
                                    <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                                    <span>Refresh</span>
                                </Button>
                            </Typography.Text>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                <Card className="border-black/5 dark:border-white/10 overflow-hidden shadow-xs">
                    <div className="divide-y divide-black/5 dark:divide-white/5">
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-muted/20">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                                    <Server className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Typography.CardTitle className="text-sm sm:text-base font-bold text-foreground font-sans">
                                            <LanguageText enText="Application Server" idText="Server Aplikasi" />
                                        </Typography.CardTitle>
                                        {serverService?.status === "healthy" ? (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <LanguageText enText="Healthy" idText="Sehat" />
                                            </Typography.P>
                                        ) : (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                                                <XCircle className="h-3.5 w-3.5" />
                                                <LanguageText enText="Unhealthy" idText="Bermasalah" />
                                            </Typography.P>
                                        )}
                                    </div>
                                    <Typography.P className="text-xs text-muted-foreground font-mono leading-relaxed">
                                        <LanguageBlurFadeText
                                            enText="Secure, scalable infrastructure for reliable application hosting."
                                            idText="Infrastruktur aman dan skalabel untuk server aplikasi."
                                        />
                                    </Typography.P>
                                </div>
                            </div>
                            <Typography.MonoText className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-black/5 dark:border-white/5 shrink-0 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px] sm:hidden">
                                    <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                </span>
                                <div className="text-right">
                                    <span className="hidden sm:block text-[10px] text-muted-foreground uppercase mb-0.5">
                                        <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                    </span>
                                    <span className="font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded border border-black/5 dark:border-white/10 text-xs inline-block">
                                        {isLoading ? "..." : (serverService?.latency || "0ms")}
                                    </span>
                                </div>
                            </Typography.MonoText>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-muted/20">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Typography.CardTitle className="text-sm sm:text-base font-bold text-foreground font-sans">
                                            <LanguageText enText="Database Server" idText="Server Basis Data" />
                                        </Typography.CardTitle>
                                        {databaseService?.status === "healthy" ? (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <LanguageText enText="Healthy" idText="Sehat" />
                                            </Typography.P>
                                        ) : (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                                                <XCircle className="h-3.5 w-3.5" />
                                                <LanguageText enText="Unhealthy" idText="Bermasalah" />
                                            </Typography.P>
                                        )}
                                    </div>
                                    <Typography.P className="text-xs text-muted-foreground font-mono leading-relaxed">
                                        <LanguageBlurFadeText
                                            enText="Secure, scalable infrastructure for reliable data storage."
                                            idText="Infrastruktur aman dan skalabel untuk penyimpanan data."
                                        />
                                    </Typography.P>
                                </div>
                            </div>
                            <Typography.MonoText className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-black/5 dark:border-white/5 shrink-0 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px] sm:hidden">
                                    <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                </span>
                                <div className="text-right">
                                    <span className="hidden sm:block text-[10px] text-muted-foreground uppercase mb-0.5">
                                        <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                    </span>
                                    <span className="font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded border border-black/5 dark:border-white/10 text-xs inline-block">
                                        {isLoading ? "..." : (databaseService?.latency || "0ms")}
                                    </span>
                                </div>
                            </Typography.MonoText>
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-muted/20">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Typography.CardTitle className="text-sm sm:text-base font-bold text-foreground font-sans">
                                            <LanguageText enText="Gemini AI Model" idText="Model AI Gemini" />
                                        </Typography.CardTitle>
                                        {aiService?.status === "healthy" ? (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <LanguageText enText="Healthy" idText="Sehat" />
                                            </Typography.P>
                                        ) : (
                                            <Typography.P className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                                                <XCircle className="h-3.5 w-3.5" />
                                                <LanguageText enText="Unhealthy" idText="Bermasalah" />
                                            </Typography.P>
                                        )}
                                    </div>
                                    <Typography.P className="text-xs text-muted-foreground font-mono leading-relaxed">
                                        <LanguageBlurFadeText
                                            enText="Secure, scalable infrastructure for reliable AI model inference."
                                            idText="Infrastruktur aman dan skalabel untuk pemrosesan AI."
                                        />
                                    </Typography.P>
                                </div>
                            </div>
                            <Typography.MonoText className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-black/5 dark:border-white/5 shrink-0 text-xs font-mono">
                                <span className="text-muted-foreground text-[11px] sm:hidden">
                                    <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                </span>
                                <div className="text-right">
                                    <span className="hidden sm:block text-[10px] text-muted-foreground uppercase mb-0.5">
                                        <LanguageBlurFadeText enText="Response Time" idText="Waktu Respon" />
                                    </span>
                                    <span className="font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded border border-black/5 dark:border-white/10 text-xs inline-block">
                                        {isLoading ? "..." : (aiService?.latency || "0ms")}
                                    </span>
                                </div>
                            </Typography.MonoText>
                        </div>
                    </div>
                </Card>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
                <Card className="border-black/5 dark:border-white/10">
                    <CardContent className="p-4 sm:p-5 space-y-3">
                        <Typography.Text className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 3.5}
                                enText="Server Architecture Details"
                                idText="Detail Arsitektur Server"
                                className="text-sm font-semibold"
                            />
                        </Typography.Text>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="p-3.5 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-2">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Cpu className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <Typography.P className="font-semibold text-foreground font-sans">
                                        <LanguageText enText="Application" idText="Aplikasi" />
                                    </Typography.P>
                                </div>
                                <Typography.P className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageBlurFadeText 
                                        enText="Hosted on Vercel's global edge network, delivering fast, scalable serverless application execution." 
                                        idText="Dihosting di jaringan edge global Vercel, menyediakan eksekusi aplikasi serverless yang cepat dan skalabel." 
                                    />
                                </Typography.P>
                            </div>
                            <div className="p-3.5 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-2">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Database className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <Typography.P className="font-semibold text-foreground font-sans">
                                        <LanguageText enText="Database" idText="Basis Data" />
                                    </Typography.P>
                                </div>
                                <Typography.P className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageBlurFadeText 
                                        enText="Powered by Supabase cloud database, providing reliable data storage and real-time connectivity." 
                                        idText="Didukung oleh basis data cloud Supabase, menyediakan penyimpanan data yang andal dan real-time." 
                                    />
                                </Typography.P>
                            </div>
                            <div className="p-3.5 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5 space-y-2">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Radio className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <Typography.P className="font-semibold text-foreground font-sans">
                                        <LanguageText enText="AI Model Gemini" idText="AI Model Gemini" />
                                    </Typography.P>
                                </div>
                                <Typography.P className="text-foreground font-sans text-xs leading-normal">
                                    <LanguageBlurFadeText 
                                        enText="Powered by Google Gemini AI, delivering intelligent conversations and fast portfolio insights." 
                                        idText="Didukung oleh Google Gemini AI, menyediakan percakapan cerdas dan wawasan portofolio yang cepat dan real-time." 
                                    />
                                </Typography.P>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
            <BlurFade delay={0.4} inView>
                <Typography.quote className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                    <Code2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <LanguageBlurFadeText 
                        enText={serverCategory?.descriptionEn || "Monitor real-time infrastructure health, database uptime, and API latency"}
                        idText={serverCategory?.descriptionId || "Pantau kesehatan infrastruktur, status uptime database, dan latensi server"}
                        className="leading-relaxed block"
                        delay={0.5}
                    />
                </Typography.quote>
            </BlurFade>
        </div>
    );
}
