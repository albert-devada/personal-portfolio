import React from "react";
import { GeoLocationData } from "@/lib";
import { useLanguage } from "@/language";

export const IfconfigOutput: React.FC<{ initialIp: string; geoData?: GeoLocationData | null }> = ({ initialIp, geoData }) => {
    const { lang } = useLanguage();

    const labels = {
        en: {
            header: "[ LOCATION METADATA ]",
            provider: "Provider:",
            city: "City:",
            region: "Region:",
            continent: "Continent:",
            country: "Country:",
            latitude: "Latitude:",
            longitude: "Longitude:",
            timezone: "Timezone:",
            unknown: "Unknown"
        },
        id: {
            header: "[ METADATA LOKASI ]",
            provider: "Layanan:",
            city: "Kota:",
            region: "Wilayah:",
            continent: "Benua:",
            country: "Negara:",
            latitude: "Lintang:",
            longitude: "Bujur:",
            timezone: "Zona:",
            unknown: "Tidak Diketahui"
        }
    };

    const language = labels[lang as "en" | "id"] || labels.en;

    return (
        <div className="mt-2 font-mono text-xs sm:text-sm text-[#e0e0e0] space-y-3 select-text">
            <div>
                <span className="text-[#00b0ff] font-bold">eth0:</span> flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
                <div className="pl-6 text-zinc-300">
                    inet <span className="text-[#00c875] font-semibold">{initialIp}</span>  netmask 255.255.255.0  broadcast {initialIp.substring(0, initialIp.lastIndexOf('.')) || "127.0.0"}.255
                </div>
                <div className="pl-6 text-zinc-400">inet6 fe80::a00:27ff:fecf:ad32  prefixlen 64  scopeid 0x20&lt;link&gt;</div>
                <div className="pl-6 text-zinc-400">ether 08:00:27:cf:ad:32  txqueuelen 1000  (Ethernet)</div>
                <div className="pl-6 text-zinc-500">RX packets 94312  bytes 124302155 (124.3 MB)</div>
                <div className="pl-6 text-zinc-500">TX packets 63211  bytes 8439102 (8.4 MB)</div>
            </div>
            {geoData && (
                <div className="border-t border-zinc-800 pt-2">
                    <span className="text-[#e6c662] font-bold">{language.header}</span>
                    <div className="grid grid-cols-[90px_1fr] gap-x-2 pl-3 mt-1 text-zinc-300">
                        <span className="text-zinc-500">{language.provider}</span><span>{geoData.connection?.org || language.unknown} ({geoData.connection?.domain || language.unknown})</span>
                        <span className="text-zinc-500">{language.city}</span><span>{geoData.city || language.unknown}</span>
                        <span className="text-zinc-500">{language.region}</span><span>{geoData.region || language.unknown}</span>
                        <span className="text-zinc-500">{language.continent}</span><span>{geoData.continent || language.unknown}</span>
                        <span className="text-zinc-500">{language.country}</span><span>{geoData.country || language.unknown} ({geoData.country_code || language.unknown})</span>
                        <span className="text-zinc-500">{language.latitude}</span><span>{geoData.latitude || language.unknown}</span>
                        <span className="text-zinc-500">{language.longitude}</span><span>{geoData.longitude || language.unknown}</span>
                        <span className="text-zinc-500">{language.timezone}</span><span>{geoData.timezone?.id || language.unknown}</span>
                    </div>
                </div>
            )}

            <div>
                <span className="text-[#00b0ff] font-bold">lo:</span> flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
                <div className="pl-6 text-zinc-400">inet 127.0.0.1  netmask 255.0.0.0</div>
                <div className="pl-6 text-zinc-400">inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;</div>
                <div className="pl-6 text-zinc-500">loop  txqueuelen 1000  (Local Loopback)</div>
            </div>
        </div>
    );
};