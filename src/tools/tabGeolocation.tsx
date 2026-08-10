"use client";

import { GeoLocationData } from "@/lib/utils";
import { UAParser } from "ua-parser-js";
import Image from "next/image";
import { 
    Globe, 
    Network, 
    Clock, 
    Navigation,
    Cpu,
    Monitor,
    Terminal,
    Code2
} from "lucide-react";

import { Card, CardContent } from "@/components/containerCard";
import { BlurFade } from "@/components/blurFade";
import BlurFadeText from "@/components/blurFadeText";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";

interface LocationTabProps {
    visitorIp: string;
    uaData: string;
    geoData: GeoLocationData | null;
}

export default function TabGeolocation({ visitorIp, uaData, geoData }: LocationTabProps) {
    const { lang } = useLanguage();

    const unknownOS = lang === "en" ? "Unknown OS" : "OS Tidak Diketahui";
    const unknownBrowser = lang === "en" ? "Unknown Browser" : "Peramban Tidak Diketahui";
    const unknownEngine = lang === "en" ? "Unknown Engine" : "Mesin Tidak Diketahui";

    const parser = new UAParser(uaData);
    const clientSpecs = {
        os: `${parser.getOS().name || unknownOS} ${parser.getOS().version || ""}`.trim() || unknownOS,
        browser: `${parser.getBrowser().name || unknownBrowser} ${parser.getBrowser().version || ""}`.trim() || unknownBrowser,
        engine: `${parser.getEngine().name || unknownEngine} v${parser.getEngine().version || ""}`.trim() || unknownEngine,
        userAgent: uaData
    };

    const displayIp = geoData?.ip || visitorIp;
    const countryName = geoData?.country || (lang === "en" ? "Unknown Country" : "Negara Tidak Diketahui");
    const flagImg = geoData?.flag?.img || "";
    const providerText = geoData?.connection?.isp || (lang === "en" ? "Provider Unknown" : "Penyedia Tidak Diketahui");

    return (
        <div className="space-y-4">
            <BlurFade delay={0.1} inView>
                <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
                    <CardContent className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-black/5 dark:border-white/10 bg-muted">
                                {flagImg && (
                                    <Image 
                                        src={flagImg} 
                                        alt={countryName}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <LanguageBlurFadeText 
                                        enText={`${geoData?.type || "IPv4"} Address`} 
                                        idText={`Alamat ${geoData?.type || "IPv4"}`} 
                                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider block" 
                                        delay={0.2} 
                                    />
                                    <span className="text-xs bg-emerald-500/10 text-emerald-500 font-mono px-1.5 py-0.2 rounded shrink-0">
                                        <LanguageText enText="Active" idText="Aktif" />
                                    </span>
                                </div>
                                <BlurFadeText text={displayIp} className="text-lg sm:text-xl font-bold font-mono tracking-tight text-foreground block break-all" delay={0.25} />
                            </div>
                        </div>
                        <div className="text-left lg:text-right w-full lg:w-auto border-t lg:border-t-0 pt-2 lg:pt-0 border-black/5 dark:border-white/10 lg:shrink-0">
                            <LanguageBlurFadeText enText="ISP Network" idText="Jaringan ISP" className="text-xs text-muted-foreground block" delay={0.2} />
                            <BlurFadeText text={providerText} className="text-sm font-semibold text-foreground truncate block max-w-70 lg:max-w-xs" delay={0.25} />
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BlurFade delay={0.15} inView>
                    <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.015]">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Navigation className="h-4 w-4" />
                                <LanguageBlurFadeText enText="Geographic Position" idText="Posisi Geografis" className="text-sm font-semibold" delay={0.25} />
                            </div>
                            <div className="flex flex-col gap-2 text-xs font-mono">
                                <div className="flex gap-2">
                                    <div className="bg-muted/40 p-2 rounded flex-1 min-w-0">
                                        <LanguageBlurFadeText enText="City" idText="Kota" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.28} />
                                        <BlurFadeText text={geoData?.city || "N/A"} className="text-foreground truncate block font-sans font-medium" delay={0.32} />
                                    </div>
                                    <div className="bg-muted/40 p-2 rounded flex-1 min-w-0">
                                        <LanguageBlurFadeText enText="Region" idText="Wilayah" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.28} />
                                        <BlurFadeText text={geoData?.region || "N/A"} className="text-foreground truncate block font-sans font-medium" delay={0.32} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="bg-muted/40 p-2 rounded flex-1 min-w-0">
                                        <LanguageBlurFadeText enText="Country" idText="Negara" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.3} />
                                        <BlurFadeText text={`${countryName} (${geoData?.country_code || "N/A"})`} className="text-foreground truncate block font-sans" delay={0.34} />
                                    </div>
                                    <div className="bg-muted/40 p-2 rounded flex-1 min-w-0">
                                        <LanguageBlurFadeText enText="Postal Code" idText="Kode Pos" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.3} />
                                        <BlurFadeText text={geoData?.postal || "N/A"} className="text-foreground block" delay={0.34} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
                <BlurFade delay={0.2} inView>
                    <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.015]">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Network className="h-4 w-4" />
                                <LanguageBlurFadeText enText="Network Infrastructure" idText="Infrastruktur Jaringan" className="text-sm font-semibold" delay={0.3} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="bg-muted/40 p-2 rounded col-span-2">
                                    <LanguageBlurFadeText enText="Organization" idText="Organisasi" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.33} />
                                    <BlurFadeText text={geoData?.connection?.org || "N/A"} className="text-foreground block font-sans truncate" delay={0.37} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="ASN Node" idText="Nodus ASN" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.35} />
                                    <BlurFadeText text={geoData?.connection?.asn ? `AS${geoData.connection.asn}` : "N/A"} className="text-foreground block" delay={0.39} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="Domain Reference" idText="Referensi Domain" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.35} />
                                    <BlurFadeText text={geoData?.connection?.domain || "N/A"} className="text-link text-primary truncate block" delay={0.39} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
                <BlurFade delay={0.25} inView>
                    <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.015]">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Clock className="h-4 w-4" />
                                <LanguageBlurFadeText enText="Timezone & Locale" idText="Zona Waktu & Lokalisasi" className="text-sm font-semibold" delay={0.35} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="bg-muted/40 p-2 rounded col-span-2">
                                    <LanguageBlurFadeText enText="Timezone ID" idText="ID Zona Waktu" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.38} />
                                    <BlurFadeText text={geoData?.timezone?.id ? `${geoData.timezone.id} (${geoData.timezone.abbr || ""})` : "N/A"} className="text-foreground block" delay={0.42} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="UTC Offset" idText="Offset UTC" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.4} />
                                    <BlurFadeText text={geoData?.timezone?.utc || "N/A"} className="text-foreground block" delay={0.44} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="Calling Code" idText="Kode Telepon" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.4} />
                                    <BlurFadeText text={geoData?.calling_code ? `+${geoData.calling_code}` : "N/A"} className="text-foreground block" delay={0.44} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
                <BlurFade delay={0.3} inView>
                    <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.015]">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Globe className="h-4 w-4" />
                                <LanguageBlurFadeText enText="System Coordinates" idText="Koordinat Sistem" className="text-sm font-semibold" delay={0.4} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="Latitude" idText="Garis Lintang" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.43} />
                                    <BlurFadeText text={geoData?.latitude ? String(geoData.latitude) : "0"} className="text-foreground block" delay={0.47} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded">
                                    <LanguageBlurFadeText enText="Longitude" idText="Garis Bujur" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.43} />
                                    <BlurFadeText text={geoData?.longitude ? String(geoData.longitude) : "0"} className="text-foreground block" delay={0.47} />
                                </div>
                                <div className="bg-muted/40 p-2 rounded col-span-2">
                                    <LanguageBlurFadeText enText="Continent / Capital" idText="Benua / Ibu Kota" className="block text-[10px] text-muted-foreground uppercase mb-0.5" delay={0.45} />
                                    <BlurFadeText text={geoData?.capital ? `${geoData.continent} — ${geoData.capital || ""}` : "N/A"} className="text-foreground uppercase block font-sans truncate" delay={0.49} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
            <BlurFade delay={0.35} inView>
                <Card className="cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Terminal className="h-4 w-4 text-primary" />
                            <LanguageBlurFadeText enText="Client Environment Specs" idText="Spesifikasi Lingkungan Klien" className="text-xs font-semibold uppercase tracking-wider font-mono text-foreground" delay={0.45} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="flex items-center gap-2.5 bg-muted/30 border border-black/5 dark:border-white/10 p-2.5 rounded-lg text-xs font-mono">
                                <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <LanguageBlurFadeText enText="Operating System" idText="Sistem Operasi" className="block text-[9px] text-muted-foreground uppercase" delay={0.48} />
                                    <BlurFadeText text={clientSpecs.os} className="text-foreground truncate block font-sans font-medium" delay={0.52} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 bg-muted/30 border border-black/5 dark:border-white/10 p-2.5 rounded-lg text-xs font-mono">
                                <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <LanguageBlurFadeText enText="Core Browser Engine" idText="Mesin Utama Peramban" className="block text-[9px] text-muted-foreground uppercase" delay={0.48} />
                                    <BlurFadeText text={clientSpecs.browser} className="text-foreground truncate block font-sans font-medium" delay={0.52} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 bg-muted/30 border border-black/5 dark:border-white/10 p-2.5 rounded-lg text-xs font-mono">
                                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <LanguageBlurFadeText enText="Render Agent" idText="Agen Pengisi Render" className="block text-[9px] text-muted-foreground uppercase" delay={0.48} />
                                    <BlurFadeText text={clientSpecs.engine} className="text-foreground truncate block font-sans font-medium" delay={0.52} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
            <BlurFade delay={0.4} inView>
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                    <Code2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <LanguageBlurFadeText 
                        enText="This footprint data from inbound networks and client specs provides the cybersecurity context needed for reconnaissance detection, anomaly detection, and access validation."
                        idText="Data jejak dari jaringan masuk dan spesifikasi klien ini menyediakan konteks keamanan siber yang diperlukan untuk deteksi pengintaian, deteksi anomali, dan validasi akses."
                        className="leading-relaxed block"
                        delay={0.5}
                    />
                </div>
            </BlurFade>
        </div>
    );
}