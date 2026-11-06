"use client";

import Link from "next/link";
import { MusicPlayer } from "@/components/ui";
import { MENU_LIST_NAVIGATION } from "@/common/constants";
import { BlurFade } from "@/components/transition";
import { useIntro } from "@/common/hooks";
import type { NavigationMenuProps } from "@/common/types/navigation";

export const MobileDock = ({ pathname }: NavigationMenuProps) => {
    const isIntroFinished = useIntro();

    return (
        <div className="lg:hidden">
            <BlurFade
                trigger={isIntroFinished}
                delay={0.35}
                offset={15}
                duration={1.15}
                direction="up"
                className="fixed bottom-25 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[384px] z-40">
                <MusicPlayer className="w-full bg-white/90 dark:bg-zinc-900/90" />
            </BlurFade>
            <BlurFade
                trigger={isIntroFinished}
                delay={0.10}
                direction="up"
                className="fixed bottom-5 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50">
                <nav className="rounded-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="flex flex-row items-center justify-around px-2 py-2 gap-1 sm:px-4 sm:gap-2 w-full bg-transparent">
                        {MENU_LIST_NAVIGATION.flatMap((group) => group.menus).map((menu, index) => {
                            const Icon = menu.icon;
                            const isActive = pathname === menu.href || (menu.href !== "/" && pathname.startsWith(menu.href));

                            return (
                                <Link
                                    key={index}
                                    href={menu.href}
                                    className={`
                                        flex items-center justify-center 
                                        w-11 h-11 sm:w-12 sm:h-12 
                                        shrink-0 rounded-full transition-all duration-300
                                        ${isActive
                                            ? "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-md scale-105"
                                            : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                        }
                                    `}
                                    aria-label={menu.labelEn || "Navigasi"}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                                        isActive ? "text-white dark:text-blue-400" : ""
                                    }`} />
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </BlurFade>
        </div>
    );
};