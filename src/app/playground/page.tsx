import type { Metadata } from "next";
import { MacWindow } from "@/partial";
import { Terminal } from "lucide-react";
import { ToolsMenu } from "@/navigation";
import { LanguageText } from "@/language";
import type { ToolTab } from "@/common/types";
import { getVisitorDetails } from "@/common/service";
import { BlurFade, Tabs, TabsContent } from "@/components";
import { TabGeolocation, TabCveTracker, TabExploitedVulns, TabBreachCheck, TabJsonFormatter, TabEncoder, TabMarketWatch, TabExchangeRate, TabServerStatus } from "@/tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Playground",
    description: "Free interactive tools including CVE Tracker, CISA Exploited Vulnerabilities, Email Data Leak, IP Geolocation, and JSON Formatter.",
    alternates: {
        canonical: "/playground",
    },
};

interface PageProps {
    searchParams: Promise<{ tab?: string }>;
}

export default async function PlaygroundPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const activeTab = (resolvedParams.tab as ToolTab) || "location";
    const { ipAddress, userAgent, GeoLocationData } =
        await getVisitorDetails(true);

    return (
        <BlurFade delay={0.25} inView>
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <Terminal className="h-6 w-6" />
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            <LanguageText
                                enText="Playground"
                                idText="Peralatan"
                            />
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        <LanguageText
                            enText="A growing collection of portfolio tools — explore, use, and experiment."
                            idText="Kumpulan alat portofolio yang terus berkembang — jelajahi, gunakan, dan bereksperimen."
                        />
                    </p>
                </div>
                <MacWindow
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
                                <ToolsMenu activeTab={activeTab} />
                            </div>
                        </aside>
                        <div className="min-w-0 flex-1">
                            <Tabs value={activeTab} className="w-full">
                                <TabsContent value="location" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="location" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabGeolocation visitorIp={ipAddress} uaData={userAgent} geoData={GeoLocationData} />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="server" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="server" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabServerStatus />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="cvedata" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="cvedata" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabCveTracker />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="exploited" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="exploited" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabExploitedVulns />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="breach" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="breach" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabBreachCheck />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="jsonformatter" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="jsonformatter" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabJsonFormatter />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="encoder" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="encoder" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabEncoder />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="market" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="market" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabMarketWatch />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                                <TabsContent value="exchanges" className="mt-0 focus-visible:outline-none">
                                    <BlurFade key="exchanges" delay={0.05} blur="4px">
                                        <div className="space-y-5">
                                            <TabExchangeRate />
                                        </div>
                                    </BlurFade>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </MacWindow>
            </div>
        </BlurFade>
    );
}
