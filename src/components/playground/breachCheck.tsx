"use client";

import Image from "next/image";
import { getApiUrl } from "@/function";
import { useState, useRef } from "react";
import { BlurFade } from "@/components/transition";
import { Card, CardContent, Button, InputGroup, InputGroupAddon, InputGroupInput } from "@/components/base";
import { appToast } from "@/components/ui";
import { Typography } from "@/theme";
import { useLanguage, LanguageText, LanguageBlurFadeText } from "@/language";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CATEGORY_PLAYGROUND } from "@/common/constants";
import {
    ShieldAlert,
    ShieldCheck,
    Search,
    Database,
    Calendar,
    Hash,
    Layers,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    Building2,
    Newspaper,
    ChevronDown,
    ChevronUp,
    Code2
} from "lucide-react";
import type { BreachItems } from "@/common/types";

const INITIAL_DISPLAY_COUNT = 5;
const BLUR_FADE_DELAY = 0.04;

export function BreachCheck() {
    const { lang } = useLanguage();
    const breachCategory = CATEGORY_PLAYGROUND.find((t) => t.id === "breach");
    const [email, setEmail] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [hasChecked, setHasChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [results, setResults] = useState<BreachItems[] | null>(null);
    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
    const turnstileRef = useRef<TurnstileInstance | null>(null);

    const handleCheckBreach = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setIsInvalid(true);
            const alertMsg = lang === "en" ? "The email format you entered is invalid." : "Format email yang anda masukkan tidak valid.";
            appToast.error(alertMsg);
            return;
        }

        setIsInvalid(false);
        setIsLoading(true);
        setHasChecked(false);
        setResults(null);
        setVisibleCount(INITIAL_DISPLAY_COUNT);

        try {
            const response = await fetch(getApiUrl(`/search?breach=${encodeURIComponent(email)}`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ turnstileToken }),
                credentials: "include",
            });

            const resData = await response.json().catch(() => null);

            if (!response.ok || !resData?.success) {
                const defaultErr = lang === "en" ? "Your request is invalid, Please try again." : "Permintaan Anda tidak valid, silakan coba lagi.";
                appToast.error(resData?.error || defaultErr);
                return;
            }

            const data = (Array.isArray(resData?.data) ? resData.data : []) as BreachItems[];
            setResults(data);
            setHasChecked(true);

            if (data.length > 0) {
                const successMsg = lang === "en" ? `The system detected ${data.length} potential data breaches.` : `Sistem mendeteksi ${data.length} potensi kebocoran data.`;
                appToast.success(successMsg);
            } else {
                const infoMsg = lang === "en" ? "Great news! You're not in any known breaches." : "Kabar baik! Email anda tidak terindikasi di kebocoran data manapun.";
                appToast.info(infoMsg);
            }

        } catch {
            const systemErr = lang === "en" ? "An internal system error occurred. Try again later." : "Terjadi kesalahan sistem internal. Coba lagi nanti.";
            appToast.error(systemErr);
        } finally {
            setIsLoading(false);
            setTurnstileToken(null);
            turnstileRef.current?.reset();
        }
    };

    const sortedBreaches = results ? [...results].sort((a, b) => new Date(b.BreachDate || 0).getTime() - new Date(a.BreachDate || 0).getTime()) : [];
    const displayedBreaches = sortedBreaches.slice(0, visibleCount);

    return (
        <div className="space-y-6">
            <BlurFade delay={BLUR_FADE_DELAY} inView>
                <Card className="overflow-hidden">
                    <CardContent className="p-3.5 sm:p-5">
                        <Typography.CardTitle className="flex items-center gap-2 text-primary mb-3">
                            <ShieldAlert className="h-4 w-4" />
                            <LanguageBlurFadeText
                                delay={BLUR_FADE_DELAY * 1.5}
                                enText="Data Leak Search"
                                idText="Pencarian Kebocoran Data"
                                className="text-sm font-semibold"
                            />
                        </Typography.CardTitle>
                        <form onSubmit={handleCheckBreach} className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <InputGroup className={`flex-1 h-10 rounded-lg border bg-background/50 transition-colors ${
                                    isInvalid 
                                        ? "border-rose-500 text-rose-600 dark:text-rose-400" 
                                        : "border-black/10 dark:border-white/10 text-foreground"
                                }`}>
                                    <InputGroupAddon align="inline-start">
                                        <Search className="size-4 text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput 
                                        type="text" 
                                        placeholder={ lang === "en" ? "Enter your email address (e.g., example@domain.com)" : "Masukkan email anda (cth: example@domain.com)"}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (isInvalid) setIsInvalid(false);
                                        }}
                                        aria-invalid={isInvalid}
                                        className="text-sm font-mono placeholder:text-muted-foreground/60"
                                        disabled={isLoading}
                                        required
                                    />
                                </InputGroup>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !email.trim()}
                                    size="lg"
                                    className="h-10 px-6 rounded-lg font-medium text-sm gap-2 shrink-0 cursor-pointer">
                                    {isLoading ? (
                                        <>
                                            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            <span>
                                                <LanguageText enText="Checking..." idText="Memeriksa..." />
                                            </span>
                                        </>
                                    ) : (
                                        <span>
                                            <LanguageText enText="Check Identity" idText="Periksa Identitas" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                            <div className="pt-2 pb-1 w-full max-w-full flex flex-col items-center justify-center gap-2">
                                <Typography.P className="text-sm text-muted-foreground font-medium text-center">
                                    <LanguageText enText="Complete the security check:" idText="Selesaikan verifikasi keamanan:" />
                                </Typography.P>
                                <div className="w-full flex items-center justify-center min-h-17.5 overflow-visible">
                                    <div className="flex justify-center items-center scale-[0.88] min-[400px]:scale-95 sm:scale-100 origin-center transition-transform">
                                        <Turnstile
                                            ref={turnstileRef}
                                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                            onSuccess={(token) => setTurnstileToken(token)}
                                            onExpire={() => setTurnstileToken(null)}
                                            onError={() => setTurnstileToken(null)}
                                            options={{
                                                theme: "auto",
                                                size: "normal",
                                                responseField: false,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>
            {hasChecked && sortedBreaches.length > 0 && (
                <div className="space-y-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(239,68,68,0.05)]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <Typography.Text>
                                    <LanguageBlurFadeText
                                        delay={BLUR_FADE_DELAY * 2.5}
                                        enText="BREACH DETECTED"
                                        idText="KEBOCORAN TERDETEKSI"
                                        className="text-xs font-bold text-red-500 uppercase tracking-widest block"
                                    />
                                    <LanguageBlurFadeText
                                        delay={BLUR_FADE_DELAY * 3}
                                        enText={`Verified breaches. ${sortedBreaches.length} data found from various valid sources.`}
                                        idText={`Kebocoran terverifikasi. ${sortedBreaches.length} data ditemukan dari berbagai sumber valid.`}
                                        className="text-sm text-slate-600 dark:text-slate-400 block font-sans mt-0.5"
                                    />
                                </Typography.Text>
                            </div>
                        </div>
                    </BlurFade>
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.75 sm:before:left-3.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-red-500/60 before:via-neutral-300 dark:before:via-neutral-800 before:to-neutral-200/20 dark:before:to-neutral-900/20">
                        {displayedBreaches.map((breach, index) => {
                            const breachYear = breach.BreachDate ? new Date(breach.BreachDate).getFullYear() : "N/A";
                            const domainUrl = breach.Domain && breach.Domain !== "N/A" ? (breach.Domain.startsWith("http") ? breach.Domain : `https://${breach.Domain}`) : null;
                            const dynamicDelay = BLUR_FADE_DELAY * 3 + Math.min(index * 0.05, 0.25);

                            return (
                                <BlurFade key={breach.Name || breach.Title || index} delay={dynamicDelay} inView>
                                    <div className="relative space-y-2">
                                        <span className="absolute -left-4.5 sm:-left-6 top-1.75 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-background z-20">
                                            <span className="absolute inset-0 rounded-full border-2 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse" />
                                        </span>                     
                                        <Typography.P className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/40">
                                            <LanguageBlurFadeText 
                                                enText={`Timeline Node: ${breachYear}`} 
                                                idText={`Garis Waktu: ${breachYear}`} 
                                            />
                                        </Typography.P>
                                        <Card className="transition-transform duration-300 hover:scale-[1.005]">
                                            <CardContent className="p-4 sm:p-5 space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-muted/60 flex items-center justify-center p-1">
                                                            <Database className="h-5 w-5 text-zinc-500 dark:text-zinc-400 absolute" />
                                                            {breach.LogoPath && (
                                                                <Image 
                                                                    src={breach.LogoPath} 
                                                                    alt={breach.Title || "Breach Logo"}
                                                                    width={32}
                                                                    height={32}
                                                                    className="object-contain z-10"
                                                                    unoptimized
                                                                />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Typography.Text className="text-base font-bold text-foreground block font-sans">
                                                                {breach.Title || (lang === "en" ? "Unknown Breach" : "Kebocoran Tidak Diketahui")}
                                                            </Typography.Text>
                                                            {domainUrl ? (
                                                                <a href={domainUrl} target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-primary font-mono inline-flex items-center gap-1 hover:underline group">
                                                                    <span>{breach.Domain}</span>
                                                                    <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-primary font-mono block">
                                                                    {breach.Domain || "N/A"}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Typography.Text className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                                                        {breach.Industry && breach.Industry !== "N/A" && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium font-mono bg-blue-500/10 text-blue-500 dark:text-blue-400 px-2 py-0.5 rounded-sm border border-blue-500/20">
                                                                <Building2 className="h-3 w-3" /> {breach.Industry}
                                                            </span>
                                                        )}
                                                        {breach.IsVerified && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                                                                <CheckCircle2 className="h-3 w-3" /> <LanguageText enText="VERIFIED" idText="TERVERIFIKASI" />
                                                            </span>
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                                <Typography.P className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                                                    <span dangerouslySetInnerHTML={{ 
                                                        __html: breach.Description || (lang === "en" ? "No description provided." : "Tidak ada deskripsi yang diberikan.") 
                                                    }} />
                                                </Typography.P>
                                                <Typography.MonoText className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                                                    <div className="bg-muted/40 p-2.5 rounded-lg flex items-center gap-2.5 min-w-0">
                                                        <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                        <div className="min-w-0">
                                                            <span className="block text-[9px] text-zinc-500 dark:text-zinc-400 uppercase">
                                                                <LanguageBlurFadeText enText="Breach Date" idText="Tanggal Kebocoran" />
                                                            </span>
                                                            <span className="text-foreground truncate block font-medium">{breach.BreachDate || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-muted/40 p-2.5 rounded-lg flex items-center gap-2.5 min-w-0">
                                                        <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                        <div className="min-w-0">
                                                            <span className="block text-[9px] text-zinc-500 dark:text-zinc-400 uppercase">
                                                                <LanguageBlurFadeText enText="Total Data Leaks" idText="Total Data Bocor" />
                                                            </span>
                                                            <span className="truncate block font-medium text-red-400">{(breach.PwnCount ?? 0).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-muted/40 p-2.5 rounded-lg flex items-center gap-2.5 min-w-0">
                                                        <Layers className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                        <div className="min-w-0">
                                                            <span className="block text-[9px] text-zinc-500 dark:text-zinc-400 uppercase">
                                                                <LanguageBlurFadeText enText="Categories Found" idText="Kategori Ditemukan" />
                                                            </span>
                                                            <span className="text-foreground truncate block font-medium">
                                                                <LanguageBlurFadeText 
                                                                    enText={`${breach.DataClasses?.length ?? 0} Category`} 
                                                                    idText={`${breach.DataClasses?.length ?? 0} Kategori`} 
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Typography.MonoText>
                                                <div className="space-y-1.5 pt-1">
                                                    <Typography.MonoText className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                                                        <LanguageBlurFadeText enText="Potential Data Exposure:" idText="Potensi Data Terekspos:" />
                                                    </Typography.MonoText>
                                                    <Typography.Text className="flex flex-wrap gap-1">
                                                        {(breach.DataClasses || []).map((item) => (
                                                            <span 
                                                                key={item} 
                                                                className="text-[11px] font-mono bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-foreground/80 px-2 py-0.5 rounded-md"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </Typography.Text>
                                                </div>
                                                {breach.Reference && (
                                                    <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                                                        <Typography.MonoText className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                                            <LanguageText enText="Report Available" idText="Laporan Tersedia" />
                                                        </Typography.MonoText>
                                                        <a
                                                            href={breach.Reference}
                                                            target="_blank"
                                                            rel="nofollow noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-xs font-semibold font-mono px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer shadow-xs">
                                                            <Newspaper className="h-3.5 w-3.5" />
                                                            <span>
                                                                <LanguageText enText="News" idText="Berita" />
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
                    {sortedBreaches.length > INITIAL_DISPLAY_COUNT && (
                        <div className="flex justify-center pt-2">
                            {visibleCount < sortedBreaches.length ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 text-xs font-mono cursor-pointer shadow-xs">
                                    <span>
                                        <LanguageText 
                                            enText={`Load More Breaches (${sortedBreaches.length - visibleCount} remaining)`} 
                                            idText={`Muat Lebih Banyak Kebocoran (tersisa ${sortedBreaches.length - visibleCount})`} 
                                        />
                                    </span>
                                    <ChevronDown className="size-3.5" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setVisibleCount(INITIAL_DISPLAY_COUNT)}
                                    className="gap-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground border-black/5 dark:border-white/10 text-xs font-mono cursor-pointer">
                                    <span>
                                        <LanguageText enText="Collapse List" idText="Ciutkan Daftar" />
                                    </span>
                                    <ChevronUp className="size-3.5" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
            {((!hasChecked && !isLoading) || (hasChecked && sortedBreaches.length === 0)) && (
                <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                    <Typography.P className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-card/20 min-h-48">
                        <div className={`p-3 rounded-full mb-3 ${hasChecked ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/5 text-primary"}`}>
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 2.5}
                            enText={hasChecked ? "System Secure — Zero Breaches Found" : "System Idle — Awaiting Targets"}
                            idText={hasChecked ? "Sistem Aman — Tidak Ada Kebocoran Ditemukan" : "Sistem Idle — Menunggu Target"}
                            className="text-sm font-semibold text-foreground text-center block"
                        />
                        <LanguageBlurFadeText
                            delay={BLUR_FADE_DELAY * 3}
                            enText={
                                hasChecked 
                                    ? "Good news! You are not involved in any known data breaches across verified indexes and legitimate news sources." 
                                    : "Incoming input targets will be processed through valid and verified news source leak data and public disclosure channels."
                            }
                            idText={
                                hasChecked 
                                    ? "Kabar baik! anda tidak terlibat dalam kebocoran data yang diketahui di seluruh indeks terverifikasi dan sumber berita resmi." 
                                    : "Target input yang masuk akan diproses melalui data kebocoran dari sumber berita terverifikasi dan saluran pengungkapan publik."
                            }
                            className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1 text-center block mx-auto"
                        />
                    </Typography.P>
                </BlurFade>
            )}
            <BlurFade delay={0.4} inView>
                <Typography.quote className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                    <Code2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <LanguageBlurFadeText 
                        enText={breachCategory?.descriptionEn || "Monitor real-time infrastructure health, database uptime, and API latency"}
                        idText={breachCategory?.descriptionId || "Pantau kesehatan infrastruktur, status uptime database, dan latensi server"}
                        className="leading-relaxed block"
                        delay={0.5}
                    />
                </Typography.quote>
            </BlurFade>
        </div>
    );
}