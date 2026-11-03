"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/utils";
import { getLogoSrc, getLinkIcon } from "@/function";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { Typography } from "@/theme";
import { BlurFade, BlurFadeText } from "@/components/transition";
import { Timeline, TimelineItem, TimelineConnectItem, Badge } from "@/components/base";
import type { ViewPagesProps } from "@/common/types";

export function ProjectExperience({ experiences: propExperiences, isFullPage = false }: ViewPagesProps) {
    const isLoading = propExperiences === undefined;

    const experiences = useMemo(() => {
        const rawData = propExperiences ?? [];
        return [...rawData].sort((a, b) => 
            new Date(String(b.released || "")).getTime() - new Date(String(a.released || "")).getTime()
        );
    }, [propExperiences]);

    const displayedExperiences = isFullPage ? experiences : experiences.slice(0, 3);

    return (
        <div className={`overflow-hidden ${isFullPage ? "" : "mt-10 md:mt-15"}`}>
            <div className="flex min-h-0 flex-col gap-y-8 w-full">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                    {!isFullPage && (
                        <div className="flex items-center w-full justify-center">
                            <div className="flex-1 h-0.5 bg-linear-to-r from-transparent from-5% via-black dark:via-white via-95% to-transparent" />
                            <div className="border border-border bg-background z-10 rounded-xl px-4 py-1">
                                <Typography.MonoText className="text-foreground text-sm font-medium">
                                    <LanguageText enText="Experience" idText="Pengalaman" />
                                </Typography.MonoText>
                            </div>
                            <div className="flex-1 h-0.5 bg-linear-to-l from-transparent from-5% via-black dark:via-white via-95% to-transparent" />
                        </div>
                    )}
                    <div className="flex flex-col gap-y-3 items-center justify-center text-center">
                        <Typography.CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            <LanguageBlurFadeText enText="I like building things" idText="Suka Membuat Sesuatu" delay={0.1} />
                        </Typography.CardTitle>
                        <Typography.P className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
                            <LanguageBlurFadeText 
                                enText="In my daily activities, I enjoy developing personal applications, handling freelance projects, and building software for clients." 
                                idText="Dalam aktivitas sehari-hari, saya senang mengembangkan aplikasi pribadi, menangani proyek freelance, dan membangun perangkat lunak untuk klien." 
                                delay={0.2} 
                            />
                        </Typography.P>
                    </div>
                </div>
                {isLoading ? (
                    <div className="w-full space-y-6">
                        {Array.from({ length: isFullPage ? 5 : 3 }).map((_, idx) => (
                            <div key={idx} className="flex items-start gap-4 animate-pulse">
                                <div className="size-11 md:size-12 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="h-3 w-1/4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md" />
                                    <div className="h-10 w-full bg-zinc-200/40 dark:bg-zinc-800/40 rounded-md mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : experiences.length === 0 ? (
                    <Typography.MonoText className="p-8 text-center rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground text-sm">
                        <LanguageText enText="Experience is currently unavailable." idText="Pengalaman belum tersedia saat ini." />
                    </Typography.MonoText>
                ) : (
                    <div className="relative w-full">
                        <div 
                            className={`w-full ${
                                !isFullPage && experiences.length > 3 
                                ? "[-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] pb-4" 
                                : ""
                            }`}>
                            <Timeline>
                                {displayedExperiences.map((exp, index) => {
                                    const baseDelay = 0.1 + index * 0.15;
                                    const rawLinks = typeof exp.links === "string" ? JSON.parse(exp.links) : exp.links;
                                    const linksArray = Array.isArray(rawLinks) ? rawLinks : [];

                                    return (
                                        <TimelineItem
                                            key={String(exp.id || (String(exp.title || "") + String(exp.released || "") + index))}
                                            className="w-full flex items-start justify-between gap-10">
                                            <TimelineConnectItem className="flex items-start justify-center">
                                                <BlurFade delay={baseDelay}>
                                                    <Image
                                                        src={getLogoSrc(typeof exp.logo_url === "string" ? exp.logo_url : null, "/experience.jpg")}
                                                        alt={String(exp.vendor || "Code Logo")}
                                                        width={50}
                                                        height={50}
                                                        priority
                                                        className="size-11 md:size-12 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border object-contain flex-none transition-all duration-300"
                                                        onError={(e) => {
                                                            const target = e.currentTarget;
                                                            target.srcset = "/experience.jpg";
                                                            target.src = "/experience.jpg";
                                                        }}
                                                    />
                                                </BlurFade>
                                            </TimelineConnectItem>
                                            <div className="flex flex-1 flex-col justify-start gap-2 min-w-0 pb-6">
                                                {exp.released && (
                                                    <time className="text-xs text-muted-foreground">
                                                        <LanguageBlurFadeText 
                                                            enText={formatDate(String(exp.released), "en")}
                                                            idText={formatDate(String(exp.released), "id")}
                                                            delay={baseDelay + 0.05} 
                                                        />
                                                    </time>
                                                )}
                                                {exp.title && (
                                                    <Typography.P className="font-semibold leading-none">
                                                        <BlurFadeText text={String(exp.title)} delay={baseDelay + 0.1} />
                                                    </Typography.P>
                                                )}
                                                {exp.vendor && (
                                                    <Typography.P className="text-sm text-muted-foreground">
                                                        <BlurFadeText text={String(exp.vendor)} delay={baseDelay + 0.15} />
                                                    </Typography.P>
                                                )}
                                                {(exp.description_en || exp.description_id) && (
                                                    <Typography.P className="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                                                        <LanguageBlurFadeText 
                                                            enText={String(exp.description_en || "")} 
                                                            idText={String(exp.description_id || "")} 
                                                            delay={baseDelay + 0.2} 
                                                        />
                                                    </Typography.P>
                                                )}
                                                {linksArray.length > 0 && (
                                                    <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                                                        {linksArray.map((link: { title: string; href: string }, idx: number) => {
                                                            const IconComponent = getLinkIcon(link.title);
                                                            return (
                                                                <Link
                                                                    href={link.href || "#"}
                                                                    key={idx}
                                                                    target="_blank"
                                                                    rel="nofollow noopener noreferrer">
                                                                    <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                                                        {IconComponent && <IconComponent className="size-3.5" />}
                                                                        <span>
                                                                            <LanguageText enText="Visit&nbsp;" idText="Kunjungi&nbsp;" />
                                                                            <span className="capitalize">{link.title}</span>
                                                                        </span>
                                                                        <ArrowUpRight className="h-3 w-3 text-primary-foreground/80" aria-hidden />
                                                                    </Badge>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </TimelineItem>
                                    );
                                })}
                                {!isFullPage && experiences.length > 3 && (
                                    <TimelineItem className="w-full flex items-start justify-between gap-10">
                                        <TimelineConnectItem className="flex items-start justify-center">
                                            <div className="size-11 md:size-12 bg-transparent flex-none" />
                                        </TimelineConnectItem>
                                        <div className="flex flex-1 flex-col justify-start gap-2 min-w-0 h-16" />
                                    </TimelineItem>
                                )}
                            </Timeline>
                        </div>
                        {!isFullPage && experiences.length > 3 && (
                            <div className="absolute bottom-10 left-0 right-0 z-20 flex items-center justify-center w-full">
                                <Link 
                                    href="/project"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    <LanguageText enText="View Experience" idText="Lihat Pengalaman" />
                                    <ArrowDown className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}