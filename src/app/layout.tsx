import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimatedBackground, ThemeProvider, ThemeBasics } from "@/theme";
import { viewport, defaultMetadata as metadata, defaultJsonLdData as jsonLdData } from "@/common/config";
import { Inter, Geist_Mono } from "next/font/google";
import { MainHeader } from "@/components/navigation";
import { LoadingScreen, ScrollProgress, ToasterProvider } from "@/components/ui";
import { LanguageProvider } from "@/language";
import { cn } from "@/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: false,
});

export { viewport, metadata };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("scroll-smooth font-sans", "font-sans", inter.variable)}>
            <head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
            </head>
            <body className={cn(geistMono.variable, inter.variable, "antialiased min-h-screen", "bg-sky-100 text-slate-900", "dark:bg-[#0f172a] dark:text-slate-50")}>
                <Analytics />
                <SpeedInsights />
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AnimatedBackground />
                    <LoadingScreen />
                    <ScrollProgress />
                    <ToasterProvider />
                    <LanguageProvider>
                        <ThemeBasics>
                            <MainHeader />
                            {children}
                        </ThemeBasics>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
