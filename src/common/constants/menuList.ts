import type { SidebarNavigationItems } from "@/common/types";
import {
    Home,
    Award,
    Rocket,
    BookOpen,
    Bot,
    Terminal
} from "lucide-react";

export const MENU_LIST_NAVIGATION: SidebarNavigationItems[] = [
    {
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
        groupLabelEn: "Resources",
        groupLabelId: "Resources",
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