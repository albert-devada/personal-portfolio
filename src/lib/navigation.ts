import {
    Home,
    Award,
    Rocket,
    BookOpen,
    Bot,
    Terminal,
    LucideIcon
} from "lucide-react";

type Menu = {
    href: string;
    labelEn: string;
    labelId: string;
    icon: LucideIcon;
};

export type SidebarMenu = {
    groupLabelEn?: string;
    groupLabelId?: string;
    menus: Menu[];
};

export const navigationMenu: SidebarMenu[] = [
    {
        groupLabelEn: "",
        groupLabelId: "",
        menus: [
            {
                href: "/",
                labelEn: "Home",
                labelId: "Beranda",
                icon: Home,
            },
            {
                href: "/certificate",
                labelEn: "Certificate",
                labelId: "Sertifikat",
                icon: Award,
            },
            {
                href: "/project",
                labelEn: "Experience",
                labelId: "Pengalaman",
                icon: Rocket,
            },
            {
                href: "/blog",
                labelEn: "Tech Insights",
                labelId: "Wawasan",
                icon: BookOpen,
            },
        ],
    },
    {
        groupLabelEn: "Application",
        groupLabelId: "Aplikasi",
        menus: [
            {
                href: "/chat",
                labelEn: "AI Assistant",
                labelId: "Asisten AI",
                icon: Bot,
            },
            {
                href: "/playground",
                labelEn: "Playground",
                labelId: "Peralatan",
                icon: Terminal,
            },
        ],
    },
];