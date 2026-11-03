"use client";

import { Terminal } from "lucide-react";
import { BlurFade } from "@/components/transition";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { MacOSWindow } from "@/components/ui";
import { PlaygroundSidebar } from "@/components/navigation";
import { Tabs, TabsContent } from "@/components/base";
import { Typography } from "@/theme";
import { YourLocation, ServerStatus,  ExploitedCVE, BreachCheck, MarketWatch ,ExchangeRate } from "@/components/playground";
import type { PlaygroundToolsProps } from "@/common/types";

export function PlaygroundTools({ activeTab = "location", visitorIp, userAgent, geoData }: PlaygroundToolsProps) {
    return (
        <div className="flex flex-col gap-y-6 mt-10">
            <div className="text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                    <Terminal className="h-6 w-6" />
                    <Typography.H3 className="text-2xl sm:text-3xl font-bold mt-0">
                        <LanguageBlurFadeText
                            enText="Playground"
                            idText="Peralatan"
                            delay={0.1}
                        />
                    </Typography.H3>
                </div>
                <Typography.P className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <LanguageBlurFadeText
                        enText="A growing collection of portfolio tools — explore, use, and experiment."
                        idText="Kumpulan alat portofolio yang terus berkembang — jelajahi, gunakan, dan bereksperimen."
                        delay={0.2}
                    />
                </Typography.P>
            </div>
            <BlurFade delay={0.3} inView inViewOnce>
                <MacOSWindow
                    title={
                        <LanguageText
                            enText="~/playground"
                            idText="~/peralatan"
                        />
                    }
                    bodyClassName="p-3 sm:p-5">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <aside className="lg:w-44 lg:shrink-0">
                            <div className="rounded-xl border border-muted/40 bg-card/40 p-2 lg:sticky lg:top-20">
                                <PlaygroundSidebar params={activeTab} />
                            </div>
                        </aside>
                        <div className="min-w-0 flex-1">
                            <Tabs value={activeTab} className="w-full">
                                <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
                                    <BlurFade key={activeTab} delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            {activeTab === "location" && <YourLocation visitorIp={visitorIp} userAgent={userAgent} geoData={geoData} />}
                                            {activeTab === "server" && <ServerStatus />}
                                            {activeTab === "exploited" && <ExploitedCVE />}
                                            {activeTab === "breach" && <BreachCheck />}
                                            {activeTab === "market" && <MarketWatch />}
                                            {activeTab === "exchanges" && <ExchangeRate />}
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </MacOSWindow>
            </BlurFade>
        </div>
    );
}

