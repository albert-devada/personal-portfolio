import { Activity } from "lucide-react";
import { TabMarket } from "@/common/types";
import { LanguageBlurFadeText } from "@/language";
import { BoxCardGrid, NewsCardList } from "@/partial";
import { BlurFade, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";

const BLUR_FADE_DELAY = 0.04;

interface MarketWidgetProps {
    tabs: TabMarket[];
    defaultValue?: string;
    infoTextEn: string;
    infoTextId: string;
}

export function MarketWidget({ tabs, defaultValue, infoTextEn, infoTextId }: MarketWidgetProps) {
    const initialValue = defaultValue || tabs[0]?.value || "";

    return (
        <div className="space-y-6">
            <Tabs defaultValue={initialValue} className="w-full space-y-6">
                <BlurFade delay={BLUR_FADE_DELAY} inView>
                    <TabsList
                        className="grid w-full"
                        style={{
                            gridTemplateColumns: `repeat(${tabs.length || 1}, minmax(0, 1fr))`,
                        }}>
                        {tabs.map((tab, idx) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="cursor-pointer">
                                <LanguageBlurFadeText
                                    enText={tab.labelEn}
                                    idText={tab.labelId}
                                    delay={BLUR_FADE_DELAY * (1.5 + idx * 0.3)}
                                />
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </BlurFade>

                {tabs.map((tab) => (
                    <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className="space-y-4">
                        {tab.type === "news" ? (
                            <NewsCardList 
                                items={tab.newsItems || []} 
                                isLoading={tab.isLoading} 
                            />
                        ) : (
                            <BoxCardGrid 
                                items={tab.items || []} 
                                isLoading={tab.isLoading} 
                            />
                        )}

                    </TabsContent>
                ))}

                <BlurFade delay={0.4} inView>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                        <Activity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <LanguageBlurFadeText
                            enText={infoTextEn}
                            idText={infoTextId}
                            className="leading-relaxed block"
                            delay={0.5}
                        />
                    </div>
                </BlurFade>
            </Tabs>
        </div>
    );
}