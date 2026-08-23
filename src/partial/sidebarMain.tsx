"use client";

import { usePathname } from "next/navigation";
import { MobileDock, DesktopMenu } from "@/navigation";

export function SidebarMain() {
    const pathname = usePathname();

    return (
        <>
            <DesktopMenu pathname={pathname} />
            <MobileDock pathname={pathname} />
        </>
    );
}