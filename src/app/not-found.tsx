"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { BlurFade, TypingAnimation, InteractiveHoverButton } from "@/components";

const BLUR_FADE_DELAY = 0.04;

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 text-center">
            <BlurFade delay={BLUR_FADE_DELAY}>
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-sky-400/20 via-slate-500/20 to-indigo-500/20 blur-2xl -z-10 animate-pulse" />
                    <div className="p-4 rounded-3xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-inner">
                        <FileQuestion className="w-16 h-16 md:w-20 md:h-20 text-slate-700 dark:text-slate-300" />
                    </div>
                </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 2} className="py-2">
                <TypingAnimation
                    words={["Something Went Wrong", "404 - Page Not Found"]}
                    blinkCursor={true}
                    pauseDelay={3000}
                    loop={true}
                    cursorStyle="line"
                    className="py-2 leading-normal text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shine bg-linear-to-l from-neutral-800 via-slate-500/80 to-neutral-700 dark:from-slate-200/80 dark:via-neutral-600 dark:to-slate-200/80"
                />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 3} className="max-w-md mt-4">
                <LanguageBlurFadeText
                    delay={BLUR_FADE_DELAY * 3}
                    enText="Oops! The page you are looking for doesn't exist or has been moved to another URL."
                    idText="Waduh! Halaman yang Anda cari tidak ditemukan atau telah dipindahkan ke URL lain."
                    className="text-sm md:text-base font-medium leading-relaxed text-slate-700/80 dark:text-slate-300/80"
                />
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Link href="/">
                    <InteractiveHoverButton
                        icon={<Home className="w-4 h-4" />}
                        hoverIcon={<ArrowLeft className="w-4 h-4" />}
                        className="bg-transparent backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
                    >
                        <LanguageText enText="Back to Home" idText="Kembali ke Beranda" />
                    </InteractiveHoverButton>
                </Link>
            </BlurFade>
        </main>
    );
}
