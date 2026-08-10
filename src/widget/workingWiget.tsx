"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkingList } from "@/common/supabase/client";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { BlurFade } from "@/components/blurFade";
import BlurFadeText from "@/components/blurFadeText";

const getLogoSrc = (src: string | null | undefined): string => {
    if (!src) return "/company.png";

    if (src.startsWith("http://")) {
        return src.replace("http://", "https://");
    }
    
    if (src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }
    
    return `/${src}`;
};

function LogoImage({ src, alt }: { src: string | null | undefined; alt: string }) {
    const [imageError, setImageError] = useState(false);
    const logoSrc = getLogoSrc(src);

    if (imageError) {
        return (
            <Image
                src="/company.png"
                alt={alt}
                width={48}
                height={48}
                className="size-10 sm:size-11 rounded-full overflow-hidden object-cover flex-none border border-black/5 dark:border-white/10"
            />
        );
    }

    return (
        <Image
            src={logoSrc}
            alt={alt}
            width={48}
            height={48}
            className="size-10 sm:size-11 rounded-full overflow-hidden object-contain flex-none border border-black/5 dark:border-white/10"
            onError={() => setImageError(true)}
        />
    );
}

type WorkingsItem = Record<string, string | number | boolean | null | undefined>;

export default function WorkSection() {
    const [workings, setWorkings] = useState<WorkingsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkingData() {
            setIsLoading(true);
            const data = await getWorkingList();

            if (data && data.length > 0) {

                const sortedData = [...data].sort((a, b) => {
                    const isAPresent = a.end_date?.toLowerCase() === "present" || a.end_date?.toLowerCase() === "sekarang";
                    const isBPresent = b.end_date?.toLowerCase() === "present" || b.end_date?.toLowerCase() === "sekarang";
                    if (isAPresent && !isBPresent) return -1;
                    if (!isAPresent && isBPresent) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });

                setWorkings(sortedData);

            } else {
                setWorkings([]);
            }

            setIsLoading(false);
        }

        fetchWorkingData();
    }, []);

    return (
        <section id="work">
            <BlurFade delay={0.1}>
                <div className="flex min-h-0 flex-col gap-y-8 mt-10 p-5 sm:p-6 rounded-2xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
                    <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            <LanguageBlurFadeText enText="Career" idText="Karir" delay={0.2} />
                            <BlurFade delay={0.3}>
                                <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent block" />
                            </BlurFade>
                        </div>
                        <div className="text-xl font-bold">
                            <LanguageBlurFadeText enText="Work Experience" idText="Pengalaman Kerja" delay={0.3} />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="w-full grid gap-4">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="size-10 sm:size-11 rounded-full bg-zinc-300 dark:bg-zinc-800 shrink-0" />
                                        <div className="flex flex-col gap-2 flex-1">
                                            <div className="h-4 w-1/3 bg-zinc-300 dark:bg-zinc-800 rounded-md" />
                                            <div className="h-3 w-1/4 bg-zinc-300/60 dark:bg-zinc-800/60 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="h-6 w-20 bg-zinc-300/60 dark:bg-zinc-800/60 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : workings.length === 0 ? (
                        <div className="p-8 text-center rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground text-sm">
                            <LanguageText 
                                enText="Work experience is currently unavailable." 
                                idText="Pengalaman kerja belum tersedia saat ini." 
                            />
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full grid gap-6">
                            {workings.map((work, index) => {
                                const baseDelay = 0.4 + index * 0.15;
                                const endDateStr = String(work.end_date || "").toLowerCase();
                                const isPresent = endDateStr === "present" || endDateStr === "sekarang";
                                const hasHref = typeof work.href_url === "string" && work.href_url.trim() !== "";
                                const companyStr = String(work.company || "");

                                return (
                                    <AccordionItem
                                        key={String(work.id || `${companyStr}-${index}`)}
                                        value={companyStr}
                                        className="w-full border-b-0 grid gap-2">
                                        <AccordionTrigger className="hover:no-underline p-0 cursor-pointer transition-colors rounded-none group [&>svg]:hidden">
                                            <div className="flex items-center gap-x-3 justify-between w-full text-left">
                                                <div className="flex items-center gap-x-3 flex-1 min-w-0">
                                                    <BlurFade delay={baseDelay}>
                                                        <a
                                                            href={hasHref && typeof work.href_url === "string" ? work.href_url : "#"}
                                                            target={hasHref ? "_blank" : "_self"}
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => {
                                                                if (hasHref) {
                                                                    e.stopPropagation();
                                                                } else {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            className={cn("inline-block rounded-full transition-opacity", hasHref && "hover:opacity-80")}
                                                        >
                                                            <LogoImage 
                                                                src={typeof work.logo_url === "string" ? work.logo_url : null} 
                                                                alt={companyStr} 
                                                            />
                                                        </a>
                                                    </BlurFade>
                                                    <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
                                                        <div className="font-semibold text-sm sm:text-base leading-none flex items-center gap-2">
                                                            <span className="truncate">
                                                                <BlurFadeText text={companyStr} delay={baseDelay + 0.1} />
                                                            </span>
                                                            <BlurFade delay={baseDelay + 0.15}>
                                                                <span className="relative inline-flex items-center w-3.5 h-3.5 flex-none">
                                                                    <ChevronRight
                                                                        className={cn(
                                                                            "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-300 ease-out",
                                                                            "translate-x-0 opacity-0",
                                                                            "group-hover:translate-x-1 group-hover:opacity-100",
                                                                            "group-data-[state=open]:opacity-0 group-data-[state=open]:translate-x-0"
                                                                        )}
                                                                    />
                                                                    <ChevronDown
                                                                        className={cn(
                                                                            "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-200",
                                                                            "opacity-0 rotate-0",
                                                                            "group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180"
                                                                        )}
                                                                    />
                                                                </span>
                                                            </BlurFade>
                                                        </div>
                                                        <div className="font-sans text-xs sm:text-sm text-muted-foreground leading-snug">
                                                            <LanguageBlurFadeText 
                                                                enText={String(work.title_en || "")} 
                                                                idText={String(work.title_id || "")} 
                                                                delay={baseDelay + 0.2} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <BlurFade delay={baseDelay + 0.25}>
                                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400 text-right flex-none px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 transition-colors">
                                                        <LanguageBlurFadeText 
                                                            enText={`${String(work.start_date || "")} - ${isPresent ? "Present" : String(work.end_date || "")}`}
                                                            idText={`${String(work.start_date || "")} - ${isPresent ? "Sekarang" : String(work.end_date || "")}`}
                                                            delay={baseDelay + 0.3} 
                                                        />
                                                    </div>
                                                </BlurFade>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-0 ml-13 sm:ml-14 text-xs sm:text-sm text-muted-foreground">
                                            <LanguageBlurFadeText 
                                                enText={String(work.description_en || "")} 
                                                idText={String(work.description_id || "")} 
                                                delay={baseDelay + 0.1} 
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </div>
            </BlurFade>
        </section>
    );
}