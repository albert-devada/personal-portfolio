"use client";

import { useIntro } from "@/common/hooks";
import { LanguageToggleSwitch } from "@/language";
import { ThemeToggleSwitch } from "@/theme";
import { cn } from "@/utils";

export interface HeaderProps {
    className?: string;
}

export function MainHeader({ className }: HeaderProps) {
    const isIntroFinished = useIntro();

    return (
        <header className={cn("fixed top-5 left-0 right-0 z-50 pointer-events-none px-5 flex items-center justify-between w-full", className)}>
            <div className="pointer-events-auto">
                <LanguageToggleSwitch className="relative" trigger={isIntroFinished} direction="up" />
            </div>
            <div className="pointer-events-auto">
                <ThemeToggleSwitch className="relative" trigger={isIntroFinished} direction="up" />
            </div>
        </header>
    );
}
