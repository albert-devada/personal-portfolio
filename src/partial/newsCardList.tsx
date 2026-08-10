"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { BlurFade } from "@/components/blurFade";
import { NewsArticleItem } from "@/common/types/playgorund";
import { LanguageBlurFadeText, LanguageText } from "@/language/languageTranslate";
import { ProxyImage } from "@/components/proxyImage";

interface NewsCardListProps {
    items: NewsArticleItem[];
    isLoading?: boolean;
}

const INITIAL_DISPLAY_COUNT = 3;
const BLUR_FADE_DELAY = 0.04;


function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    if (dateStr.length >= 8 && !dateStr.includes("-")) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const date = new Date(`${year}-${month}-${day}`);

        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }
    }
    return dateStr;
}

function getSentimentStyle(sentiment?: string) {
    if (!sentiment) return "bg-muted/80 text-muted-foreground border-border/40";
    const s = sentiment.toLowerCase();

    if (s.includes("bullish")) {
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }

    if (s.includes("bearish")) {
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }

    return "bg-muted/80 text-muted-foreground border-border/40";
}

function getSentimentLabel(sentiment?: string) {
    if (!sentiment) return { en: "", id: "" };
    const s = sentiment.toLowerCase().replace("_", "-");

    switch (s) {
        case "bullish":
            return { en: "Strong Positive", id: "Sangat Positif" };
        case "somewhat-bullish":
            return { en: "Slightly Positive", id: "Cenderung Positif" };
        case "neutral":
            return { en: "Neutral", id: "Netral" };
        case "somewhat-bearish":
            return { en: "Slightly Negative", id: "Cenderung Negatif" };
        case "bearish":
            return { en: "Strong Negative", id: "Sangat Negatif" };
        default:
            return { en: sentiment, id: sentiment };
    }
}

export function NewsCardList({ items, isLoading }: NewsCardListProps) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
    const displayedItems = items.slice(0, visibleCount);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    <LanguageText enText="Latest News Market" idText="Berita Pasar Terbaru"/>
                </h2>
            </div>
            {isLoading ? (
                <div className="space-y-2.5">
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                        <LanguageBlurFadeText enText="Fetching latest market news..." idText="Memuat berita pasar terbaru..." className="animate-pulse" />
                    </div>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="p-3 sm:p-3.5 rounded-xl border border-border/50 bg-card/40 flex flex-col-reverse sm:flex-row items-start justify-between gap-3 animate-pulse">
                            <div className="flex-1 space-y-2 w-full">
                                <div className="flex items-center gap-2">
                                    <div className="h-3.5 w-20 bg-muted rounded" />
                                    <div className="h-3.5 w-16 bg-muted rounded" />
                                    <div className="h-3 w-20 bg-muted rounded" />
                                </div>
                                <div className="h-4.5 w-3/4 bg-muted rounded" />
                                <div className="h-3 w-full bg-muted rounded" />
                                <div className="h-3 w-2/3 bg-muted rounded" />
                            </div>
                            <div className="w-full sm:w-28 h-18 bg-muted rounded-lg shrink-0" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="space-y-2.5">
                        {displayedItems.map((item, index) => {
                            const tickers = item.ticker ? Array.isArray(item.ticker) ? item.ticker : [item.ticker] : [];
                            const sentimentLabel = getSentimentLabel(item.sentiment);

                            return (
                                <BlurFade key={item.id} delay={BLUR_FADE_DELAY * 2 + index * 0.05} inView>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group relative p-3 sm:p-3.5 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 flex flex-col-reverse sm:flex-row items-start justify-between gap-3 sm:gap-3.5 cursor-pointer">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <span className="px-1.5 py-0.5 rounded bg-muted font-medium text-foreground/80 border border-border/40">
                                                    <LanguageText enText="Source" idText="Sumber" />{" "}
                                                    {item.badge}
                                                </span>
                                                {item.sentiment && (
                                                    <span className={`px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] border capitalize ${getSentimentStyle(item.sentiment,)}`}>
                                                        <LanguageText enText={sentimentLabel.en} idText={sentimentLabel.id}/>
                                                    </span>
                                                )}
                                                <span>•</span>
                                                <span>
                                                    <LanguageText enText="Published" idText="Diterbitkan" />{" "}
                                                    {formatDate(item.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between gap-2 pt-0.5">
                                                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">{item.title}</h3>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 shrink-0 mt-0.5" />
                                            </div>
                                            {tickers.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                                    {tickers.map((ticker, tIdx) => (
                                                        <span
                                                            key={tIdx}
                                                            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground border border-border/40">
                                                            {ticker}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-0.5">{item.description}</p>
                                        </div>
                                        {item.imageUrl && (
                                            <div className="relative w-full sm:w-32 h-24 sm:h-22 rounded-lg overflow-hidden shrink-0 border border-border/40 bg-muted self-center">
                                                <ProxyImage 
                                                    src={item.imageUrl} 
                                                    alt={item.title} 
                                                    fill 
                                                    sizes="(max-width: 640px) 100vw, 128px"
                                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                    </a>
                                </BlurFade>
                            );
                        })}
                    </div>
                    {items.length > INITIAL_DISPLAY_COUNT && (
                        <div className="flex justify-center pt-2">
                            {visibleCount < items.length ? (
                                <button type="button"
                                    onClick={() =>
                                        setVisibleCount((prev) => prev + 3)
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-mono font-medium transition-all cursor-pointer shadow-xs">
                                    <span>
                                        <LanguageText
                                            enText={`Show More News (${items.length - visibleCount} remaining)`}
                                            idText={`Muat Lebih Banyak Berita (tersisa ${items.length - visibleCount})`}
                                        />
                                    </span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                            ) : (
                                <button type="button"
                                    onClick={() =>
                                        setVisibleCount(INITIAL_DISPLAY_COUNT)
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground border border-black/5 dark:border-white/10 text-xs font-mono font-medium transition-all cursor-pointer">
                                    <span>
                                        <LanguageText
                                            enText="Collapse News"
                                            idText="Ciutkan Berita"
                                        />
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