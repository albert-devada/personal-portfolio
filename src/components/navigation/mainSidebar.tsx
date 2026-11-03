"use client";

import { usePathname } from "next/navigation";
import { useBreakpoint } from "@/common/hooks";
import { DesktopMenu } from "./desktopMenu";
import { MobileDock } from "./moblieDock";
import type { PersonalProfile } from "@/common/types";

interface SidebarMainProps {
    profile?: PersonalProfile | null;
}

export function SidebarMain({ profile }: SidebarMainProps) {
    const pathname = usePathname();
    const isDesktop = useBreakpoint("lg");

    return isDesktop ? (
        <DesktopMenu pathname={pathname} profile={profile} />
    ) : (
        <MobileDock pathname={pathname} />
    );
}