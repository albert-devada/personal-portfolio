import Image from "next/image";
import { Card, CardContent } from "@/components/containerCard";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { BlurFade } from "@/components/blurFade";
import { LanguageBlurFadeText } from "@/language/languageTranslate";
import { BaseMarketItem } from "@/common/types/playgorund";

const BLUR_FADE_DELAY = 0.04;

interface BoxCardGridProps {
    items: BaseMarketItem[];
    isLoading?: boolean;
}

export function BoxCardGrid({ items, isLoading }: BoxCardGridProps) {
    const formatPercent = (percent: number) => {
        const formatted = percent.toFixed(2);
        return `${percent >= 0 ? "+" : ""}${formatted}%`;
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                    <LanguageBlurFadeText enText="Fetching real-time market data..." idText="Memuat data pasar real-time..." className="animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="h-44 animate-pulse">
                            <CardContent className="py-6 px-4 flex flex-col justify-between h-full">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-24 bg-muted rounded" />
                                        <div className="h-3 w-16 bg-muted rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-6 w-28 bg-muted rounded" />
                                    <div className="h-3 w-20 bg-muted rounded" />
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="h-3 w-36 bg-muted rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => {
                const IconComponent = item.icon;

                return (
                    <BlurFade key={item.id} delay={BLUR_FADE_DELAY * 2 + index * 0.05} inView>
                        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer">
                            <CardContent className="py-6 px-4 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full border object-cover shrink-0"
                                                    unoptimized
                                                />
                                            )}
                                            {IconComponent && (
                                                <div className={`p-2 rounded-full border ${item.iconColor || "border-primary/20 bg-primary/10"} shrink-0`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground uppercase font-mono">{item.symbol}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-xl font-bold font-mono">{item.main_price}</p>
                                        <div className="flex items-center gap-2">
                                            {item.price_change_percentage_24h >= 0 
                                            ? (<TrendingUp className="w-4 h-4 text-green-500 shrink-0" />) 
                                            : (<TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                                            )}
                                            <span
                                                className={`text-sm font-medium ${
                                                    item.price_change_percentage_24h >= 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                }`}>
                                                {formatPercent(item.price_change_percentage_24h)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">24h</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground pt-3 border-t font-sans mt-4">
                                    {item.sub_text}
                                </p>
                            </CardContent>
                        </Card>
                    </BlurFade>
                );
            })}
        </div>
    );
}