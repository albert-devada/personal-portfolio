"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { BlurFade } from "@/components/transition";
import { TypingAnimation, InteractiveHoverButton } from "@/components/ui";
import { cn } from "@/utils";

const BLUR_FADE_DELAY = 0.10;

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        console.error(error);
    }, [error]);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4 text-center">
            <BlurFade delay={BLUR_FADE_DELAY}>
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-rose-500/20 via-red-500/20 to-amber-500/20 blur-2xl -z-10 animate-pulse" />
                    <div className="p-4 rounded-3xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-inner">
                        <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-rose-500 dark:text-rose-400" />
                    </div>
                </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 2} className="py-2">
                <TypingAnimation
                    words={["Something Went Wrong", "500 - Server Error"]}
                    blinkCursor={true}
                    pauseDelay={3000}
                    loop={true}
                    cursorStyle="line"
                    className="py-2 leading-normal text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shine bg-linear-to-l from-neutral-800 via-slate-500/80 to-neutral-700 dark:from-slate-200/80 dark:via-neutral-600 dark:to-slate-200/80"
                />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 5} className="max-w-md mt-4">
                <LanguageBlurFadeText
                    delay={BLUR_FADE_DELAY * 5}
                    enText="An unexpected error occurred while loading this page. Please try refreshing or go back to home."
                    idText="Terjadi kesalahan tak terduga saat memuat halaman ini. Silakan coba muat ulang atau kembali ke beranda."
                    className="text-sm md:text-base font-medium leading-relaxed text-slate-700/80 dark:text-slate-300/80"
                />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <InteractiveHoverButton
                    onClick={handleRefresh}
                    disabled={isPending}
                    hoverIcon={<RefreshCw className={cn("w-4 h-4", isPending ? "animate-spin" : "animate-spin")} />}
                    className="bg-transparent backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300">
                    <LanguageText enText="Try Again" idText="Coba Lagi" />
                </InteractiveHoverButton>
                <Link href="/">
                    <InteractiveHoverButton
                        icon={<Home className="w-4 h-4" />}
                        hoverIcon={<ArrowLeft className="w-4 h-4" />}
                        className="bg-transparent backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300">
                        <LanguageText enText="Back to Home" idText="Kembali ke Beranda" />
                    </InteractiveHoverButton>
                </Link>
            </BlurFade>
        </div>
    );
}
