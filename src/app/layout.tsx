import { cn } from "@/lib";
import Script from "next/script"
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SidebarMain, MainFooter } from "@/partial";
import { Geist_Mono, Inter } from "next/font/google";
import { MetadataConstants } from "@/common/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider, LanguageToggle } from "@/language";
import { AnimatedBackground, ThemeProvider, ThemeToggle } from "@/theme";
import { ToasterProvider, ScrollProgress, ScrollToTopButton, LoadingScreen } from "@/components";

import "./globals.css";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const ogImage = MetadataConstants.preview || "/preview.png";

export const metadata: Metadata = {
    title: {
        default: `${MetadataConstants.exTitle} Portfolio | Cybersecurity & Backend Enthusiast`,
        template: `%s | ${MetadataConstants.exTitle}`,
    },
    metadataBase: new URL(process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.APP_DOMAIN ?? "http://localhost:3000"),
    description: MetadataConstants.description,
    keywords: MetadataConstants.keyword,
    creator: MetadataConstants.creator,
    authors: [
        {
            name: MetadataConstants.authors.name,
            url: MetadataConstants.authors.url,
        },
    ],
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
    openGraph: {
        title: `Portfolio ${MetadataConstants.exTitle}`,
        description: MetadataConstants.description,
        url: MetadataConstants.openGraph.url,
        siteName: MetadataConstants.openGraph.siteName,
        locale: MetadataConstants.openGraph.locale,
        type: "website",
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `Portfolio ${MetadataConstants.exTitle}`,
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    twitter: {
        card: "summary_large_image",
        title: `Portfolio ${MetadataConstants.exTitle}`,
        description: MetadataConstants.description,
        images: [ogImage],
    },
    abstract: MetadataConstants.description,
    category: "Portfolio & Cybersecurity Utilities",
    alternates: {
        canonical: "./",
        types: {
            "application/rss+xml": "/feed.xml",
        },
    },
};

function JsonLdScript() {

    const siteUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.APP_DOMAIN ?? "";

    const personal = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: MetadataConstants.authors.name,
        alternateName: ["Naufal Burhan", "Albert Devada", "albert_devada"],
        url: siteUrl,
        jobTitle: MetadataConstants.authors.jobTitle,
        description: MetadataConstants.description,
        knowsAbout: [
            "Cybersecurity",
            "Backend Engineering",
            "Penetration Testing",
            "Ethical Hacking",
            "Bug Hunting",
            "Laravel",
            "Next.js",
            "TypeScript",
            "Vulnerability Assessment",
            "Web Security"
        ],
        sameAs: [
            siteUrl,
            MetadataConstants.authors.github,
            MetadataConstants.authors.linkedin,
            MetadataConstants.authors.instagram,
            MetadataConstants.authors.hackerone,
        ].filter(Boolean),
    };

    const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: `${MetadataConstants.authors.displayName} (Albert Devada) | Portfolio & Cybersecurity Utilities`,
        url: siteUrl,
        description: MetadataConstants.description,
        author: {
            "@id": `${siteUrl}/#person`,
        },
        publisher: {
            "@id": `${siteUrl}/#person`,
        },
        inLanguage: ["en-US", "id-ID"],
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [personal, website],
    };

    return (
        <Script
            id="json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

    return (
        <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
            <head>
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
            </head>
            <body className={cn(geistMono.variable, inter.variable, "antialiased min-h-screen", "bg-sky-100 text-slate-900", "dark:bg-[#0f172a] dark:text-slate-50")}>
                <JsonLdScript />
                <Analytics />
                <SpeedInsights />
                <ThemeProvider>
                    <AnimatedBackground />
                    <LoadingScreen />
                    <LanguageProvider>
                        <ScrollProgress />
                        <ToasterProvider />
                        <div className="relative z-10 flex max-w-7xl mx-auto w-full min-h-screen">
                            <SidebarMain />
                            <div className="flex-1 w-full max-w-4xl mx-auto pt-3 pb-32 sm:py-20 px-6">
                                <main className="min-h-dvh pt-13 flex flex-col gap-10 sm:gap-14 relative w-full">
                                    <div className="fixed top-5 left-5 z-50">
                                        <LanguageToggle />
                                    </div>
                                    <div className="fixed top-5 right-5 z-50">
                                        <ThemeToggle />
                                    </div>
                                    {children}
                                    <MainFooter />
                                </main>
                            </div>
                        </div>
                        <ScrollToTopButton />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}