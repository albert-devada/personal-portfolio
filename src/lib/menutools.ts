import {
    MapPin,
    Server,
    ShieldAlert,
    Flame,
    MailCheck,
    Code,
    Binary,
    TrendingUp,
    Coins,
} from "lucide-react";
import type { ToolItem } from "@/common/types/playgorund";

export const TOOLS: ToolItem[] = [
    {
        id: "location",
        nameEn: "Your Location",
        nameId: "Lokasi Anda",
        icon: MapPin,
        categoryEn: "Information",
        categoryId: "Informasi",
    },
    {
        id: "server",
        nameEn: "Server Status",
        nameId: "Status Server",
        icon: Server,
        categoryEn: "Information",
        categoryId: "Informasi",
    },
    {
        id: "cvedata",
        nameEn: "CVE Tracker",
        nameId: "Pelacak CVE",
        icon: ShieldAlert,
        categoryEn: "CyberSecurity",
        categoryId: "Keamanan Siber",
    },
    {
        id: "exploited",
        nameEn: "Exploited Vulns",
        nameId: "Kerentanan Aktif",
        icon: Flame,
        categoryEn: "CyberSecurity",
        categoryId: "Keamanan Siber",
    },
    {
        id: "breach",
        nameEn: "Breach Check",
        nameId: "Cek Data Bocor",
        icon: MailCheck,
        categoryEn: "CyberSecurity",
        categoryId: "Keamanan Siber",
    },
    {
        id: "jsonformatter",
        nameEn: "JSON Formatter",
        nameId: "Format JSON",
        icon: Code,
        categoryEn: "Developer Utilities",
        categoryId: "Alat Developer",
    },
    {
        id: "encoder",
        nameEn: "Encoding",
        nameId: "Enkoding",
        icon: Binary,
        categoryEn: "Developer Utilities",
        categoryId: "Alat Developer",
    },
    {
        id: "market",
        nameEn: "Market Watch",
        nameId: "Pantau Pasar",
        icon: TrendingUp,
        categoryEn: "Real-Time Data",
        categoryId: "Data Real-Time",
    },
    {
        id: "exchanges",
        nameEn: "Exchange Rate",
        nameId: "Nilai Tukar",
        icon: Coins,
        categoryEn: "Real-Time Data",
        categoryId: "Data Real-Time",
    },
];

export const CATEGORY_ORDER = [
    { en: "Information", id: "Informasi" },
    { en: "CyberSecurity", id: "Keamanan Siber" },
    { en: "Developer Utilities", id: "Alat Developer" },
    { en: "Real-Time Data", id: "Data Real-Time" },
] as const;

export const GROUPED_TOOLS = CATEGORY_ORDER.map((cat) => ({
    categoryEn: cat.en,
    categoryId: cat.id,
    tools: TOOLS.filter((t) => t.categoryEn === cat.en),
})).filter((g) => g.tools.length > 0);
