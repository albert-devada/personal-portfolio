import { Activity } from "lucide-react";
import { LanguageBlurFadeText } from "@/language";
import { BlurFade } from "@/components/transition";
import { PlaygroundMarket } from "@/components/ui";
import { Typography } from "@/theme";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/base";
import type { GenericTabsProps, BaseMarketItems } from "@/common/types";

const BLUR_FADE_DELAY = 0.04;

export function PlaygroundTabs<T>( { tabs, defaultValue, value, onValueChange, descriptionEn, descriptionId, renderContent }: GenericTabsProps<T> ) {
    const initialValue = defaultValue || tabs[0]?.value || "";

    return (
        <div className="space-y-6">
            <Tabs 
                defaultValue={initialValue}
                value={value}
                onValueChange={onValueChange}
                className="w-full space-y-6">
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
                        {renderContent ? (
                            renderContent(tab)
                        ) : (
                            <PlaygroundMarket 
                                items={(tab.items as unknown as BaseMarketItems[]) || []} 
                                isLoading={tab.isLoading} 
                            />
                        )}
                    </TabsContent>
                ))}
                <BlurFade delay={0.4} inView>
                    <Typography.quote className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                        <Activity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <LanguageBlurFadeText
                            enText={descriptionEn}
                            idText={descriptionId}
                            className="leading-relaxed block"
                            delay={0.5}
                        />
                    </Typography.quote>
                </BlurFade>
            </Tabs>
        </div>
    );
}