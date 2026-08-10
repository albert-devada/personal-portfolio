"use client";

import Link from "next/link";
import type { ToolTab } from "@/common/types/playgorund";
import { cn } from "@/lib/utils";
import { GROUPED_TOOLS } from "@/lib/menutools";
import { useLanguage } from "@/language/languageProvider";

interface ToolsMenuProps {
    activeTab: ToolTab;
}

export default function ToolsMenu({ activeTab }: ToolsMenuProps) {
    const { lang } = useLanguage();

    return (
        <nav className="space-y-4" aria-label="Playground Tools Navigation">
            {GROUPED_TOOLS.map(({ categoryEn, categoryId, tools }) => {
                const categoryLabel = lang === "en" ? categoryEn : categoryId;

                return (
                    <div key={categoryEn}>
                        <p className="mb-1.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">{categoryLabel}</p>
                        <div className="grid grid-cols-2 gap-1 lg:grid-cols-1 lg:gap-0.5">
                            {tools.map((tool) => {
                                const Icon = tool.icon;
                                const isActive = activeTab === tool.id;
                                const toolName = lang === "en" ? tool.nameEn : tool.nameId;

                                return (
                                    <Link
                                        key={tool.id}
                                        href={`/playground?tab=${tool.id}`}
                                        scroll={false}
                                        aria-current={isActive ? "page" : undefined}
                                        className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                                            isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground/80 hover:bg-muted hover:text-foreground"
                                        )}>
                                        <Icon
                                            className={cn("h-4 w-4 shrink-0 transition-colors",
                                                isActive ? "text-primary" : "text-muted-foreground"
                                            )}
                                        />
                                        <span className="truncate">{toolName}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}