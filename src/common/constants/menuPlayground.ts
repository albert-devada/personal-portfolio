import { MapPin, Server, ShieldAlert, MailCheck, TrendingUp, Coins } from "lucide-react";
import type { PlaygroundCategoryGroup, PlaygroundMenuItems } from "@/common/types";

export const PLAYGROUND_MENU: PlaygroundCategoryGroup[] = [
    {
        categoryEn: "Information",
        categoryId: "Informasi",
        tools: [
            {
                id: "location",
                nameEn: "Your Location",
                nameId: "Lokasi Anda",
                icon: MapPin,
                descriptionEn: "Inspect visitor IP address, client network details, and geolocation data",
                descriptionId: "Periksa alamat IP pengunjung, rincian jaringan klien, dan data geolokasi",
            },
            {
                id: "server",
                nameEn: "Server Status",
                nameId: "Status Server",
                icon: Server,
                descriptionEn: "Monitor real-time infrastructure health, database uptime, and API latency",
                descriptionId: "Pantau kesehatan infrastruktur, status uptime database, dan latensi server",
            },
        ],
    },
    {
        categoryEn: "CyberSecurity",
        categoryId: "Keamanan Siber",
        tools: [
            {
                id: "exploited",
                nameEn: "CVE Tracker",
                nameId: "Pelacak CVE",
                icon: ShieldAlert,
                descriptionEn: "Search CVE ID vulnerabilities and track Active Exploited Vulnerabilities catalog",
                descriptionId: "Pencarian kerentanan CVE ID dan pemantauan Active Exploited Vulnerabilities",
            },
            {
                id: "breach",
                nameEn: "Breach Check",
                nameId: "Data Bocor",
                icon: MailCheck,
                descriptionEn: "Check whether your email account has been compromised in known data leaks",
                descriptionId: "Periksa apakah akun email Anda pernah terlibat dalam insiden kebocoran data",
            },
        ],
    },
    {
        categoryEn: "Real-Time Data",
        categoryId: "Data Real-Time",
        tools: [
            {
                id: "market",
                nameEn: "Market Watch",
                nameId: "Pantau Pasar",
                icon: TrendingUp,
                descriptionEn: "Real-time tracking and market data for Cryptocurrencies and US Stocks",
                descriptionId: "Pemantauan waktu nyata untuk pasar Cryptocurrency dan Saham AS",
            },
            {
                id: "exchanges",
                nameEn: "Exchange Rate",
                nameId: "Nilai Tukar",
                icon: Coins,
                descriptionEn: "Global foreign currency exchange rates and real-time energy commodity prices",
                descriptionId: "Nilai tukar mata uang global (Currency) dan harga komoditas energi dunia",
            },
        ],
    },
];

export const CATEGORY_PLAYGROUND: PlaygroundMenuItems[] = PLAYGROUND_MENU.flatMap((group) =>
    group.tools.map((tool) => ({
        ...tool,
        categoryEn: group.categoryEn,
        categoryId: group.categoryId,
    }))
);