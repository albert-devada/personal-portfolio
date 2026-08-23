"use client";

import { useLanguage } from "@/language";
import { getExperienceList } from "@/common/supabase";
import React, { useEffect, useState, useRef } from "react";

type ExperienceItem = Record<string, string | number | boolean | null | undefined>;

export interface FormattedExperience {
    released: string;
    title: string;
    vendor: string;
    description_en: string;
    description_id: string;
}

export const ExperienceOutput: React.FC<{ input: string }> = ({ input }) => {
    const { lang } = useLanguage();
    const [experiences, setExperiences] = useState<FormattedExperience[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const content = {
        en: {
            loading: "Reading operational audit log records...",
            error: "ERR_LOG_READ_FAILED: Unable to retrieve audit log from remote repository.",
            backHint: "* Type 'back' to return to the help payload menu.",
        },
        id: {
            loading: "Membaca catatan log audit operasional...",
            error: "ERR_LOG_READ_FAILED: Gagal mengambil log audit dari repositori jarak jauh.",
            backHint: "* Ketik 'back' untuk kembali ke menu sebelumnya.",
        },
    };

    const language = content[lang as "en" | "id"] || content.en;

    const formatDate = (dateStr: string) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        const months: Record<string, string> = {
            jan: "01", feb: "02", mar: "03", apr: "04", mei: "05", may: "05", 
            jun: "06", jul: "07", aug: "08", ags: "08", sep: "09", oct: "10", 
            okt: "10", nov: "11", dec: "12", des: "12"
        };
        const cleanStr = dateStr.toLowerCase().replace(/,/g, "");
        const parts = cleanStr.split(" ");
        if (parts.length === 3) {
            const month = months[parts[0].substring(0, 3)] || "01";
            const day = parts[1].padStart(2, "0");
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    };

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            const frameId = requestAnimationFrame(() => {
                const timer = setTimeout(() => {
                    let parent = containerRef.current?.parentElement;

                    while (parent) {
                        const style = window.getComputedStyle(parent);
                        const isScrollable = style.overflowY === "auto" || style.overflowY === "scroll";

                        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
                            parent.scrollTo({
                                top: parent.scrollHeight,
                                behavior: "smooth",
                            });
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }, 100);

                return () => clearTimeout(timer);
            });

            return () => cancelAnimationFrame(frameId);
        }
    }, [isLoading]);

    useEffect(() => {
        let isMounted = true;

        async function fetchExperiences() {
            try {
                setIsLoading(true);
                setIsError(false);

                const [rawData] = await Promise.all([
                    getExperienceList(),
                    new Promise((resolve) => setTimeout(resolve, 800)),
                ]);

                if (!rawData || rawData.length === 0) {
                    if (isMounted) {
                        setIsError(true);
                        setExperiences([]);
                    }
                    return;
                }

                if (isMounted) {
                    const formatted = (rawData as ExperienceItem[]).slice(0, 5).map((item) => ({
                        released: String(item.released ?? ""),
                        title: String(item.title ?? ""),
                        vendor: String(item.vendor ?? ""),
                        description_en: String(item.description_en ?? item.description ?? ""),
                        description_id: String(item.description_id ?? item.description ?? ""),
                    }));

                    setExperiences(formatted);
                }
            } catch {
                if (isMounted) {
                    setIsError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchExperiences();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div ref={containerRef} className="mt-2 font-mono text-xs sm:text-sm text-zinc-300 space-y-1 select-text max-w-2xl">
            <div>
                <span className="text-[#00b0ff]">naufal㉿kali</span>
                <span className="text-zinc-400">:</span>
                <span className="text-white">~$</span>
                <span className="text-[#e0e0e0] ml-2">{input}</span>
            </div>
            {isLoading ? (
                <div className="text-zinc-400 animate-pulse pt-1 select-none">
                    <span className="text-amber-400 font-medium">[~]</span>{" "}
                    {language.loading}
                </div>
            ) : isError || experiences.length === 0 ? (
                <div className="pt-1 text-red-400 font-medium select-none">
                    <span className="text-red-500 font-bold">[!]</span>{" "}
                    {language.error}
                </div>
            ) : (
                <div className="leading-relaxed text-[11px] sm:text-xs bg-black/20 p-2.5 rounded border border-zinc-800 space-y-1 mt-1.5">
                    {experiences.map((item, index) => {
                        const description = lang === "id" 
                            ? (item.description_id || item.description_en) 
                            : (item.description_en || item.description_id);
                        return (
                            <div key={index} className="whitespace-pre-line">
                                <span className="text-zinc-500">[{formatDate(item.released)}]</span>{" "}
                                <span className="text-[#00c875] font-medium">[{item.title}]</span>{" "}
                                <span className="text-white font-semibold">{item.vendor}</span> - {description}
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="text-zinc-500 text-[12px] pt-1 select-none font-light animate-pulse">{language.backHint}</div>
        </div>
    );
};