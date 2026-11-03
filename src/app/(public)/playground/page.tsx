import type { Metadata } from "next";
import type { PlaygroundPageProps } from "@/common/types";
import { getVisitorDetails } from "@/common/service";
import { generateBreadcrumbJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { PlaygroundTools } from "@/contents";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Playground",
    description: "Interactive security tools: CVE Tracker, CISA KEV exploits, and live feeds",
    alternates: {
        canonical: "/playground",
    },
};



export default async function PlaygroundPage({ searchParams }: PlaygroundPageProps) {
    const resolvedParams = await searchParams;
    const activeTab = resolvedParams?.tab || "location";
    const { ipAddress, userAgent, GeoLocationData } = await getVisitorDetails(true);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Playground", url: "/playground" },
    ]);

    return (
        <Section id="Playground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <PlaygroundTools
                activeTab={activeTab}
                visitorIp={ipAddress}
                userAgent={userAgent}
                geoData={GeoLocationData}
            />
        </Section>
    );
}


