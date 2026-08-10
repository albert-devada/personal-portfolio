"use client";

import { usePathname } from "next/navigation";
import { DesktopMenu } from "@/navigation/desktopMenu";
import { MobileDock } from "@/navigation/mobileDock";

const SidebarMain = () => {
    const pathname = usePathname();

    return (
        <>
            <DesktopMenu pathname={pathname} />
            <MobileDock pathname={pathname} />
        </>
    );
};

export default SidebarMain;