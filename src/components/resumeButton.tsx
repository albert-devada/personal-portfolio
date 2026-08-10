"use client";

import { ChevronRight } from "lucide-react";
import { appToast } from "./sonnerProvider";
import { ShimmerButton } from "./shimmerButton";
import { LanguageText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";

interface ResumeButtonProps {
    portfolioUrl: string | null | undefined;
}

export default function ResumeDowload({ portfolioUrl }: ResumeButtonProps) {
    const { lang } = useLanguage();

    const handleAlert = () => {
        const alertMsg = lang === "en" ? "The portfolio PDF is currently unavailable." : "File PDF portofolio saat ini belum tersedia.";
        appToast.info(alertMsg);
    };

    return (
        portfolioUrl ? (
            <a href={portfolioUrl} download="Resume_Portofolio.pdf" className="inline-block w-full">
                <ShimmerButton borderRadius="16px" className="w-full justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-2xl border border-black/5 dark:border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-zinc-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <LanguageText enText="Download Portofolio" idText="Unduh Portofolio" />
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </ShimmerButton>
            </a>
        ) : (
            <ShimmerButton onClick={handleAlert} borderRadius="16px" className="w-full justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-2xl border border-black/5 dark:border-white/10 shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-center gap-1.5">
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-zinc-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                        <LanguageText enText="Download Portofolio" idText="Unduh Portofolio" />
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </ShimmerButton>
        )
    );
}