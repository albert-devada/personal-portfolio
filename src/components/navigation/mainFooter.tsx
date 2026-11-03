"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { MEDIA_SOCIALS_PROFILE } from "@/common/constants";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/base";
import { BlurFade } from "@/components/transition";
import { Terminal, Heart, Coffee } from "lucide-react";

export function MainFooter({ coverSrc = "/cover.gif", name, instagram }: { coverSrc?: string, name?: string, instagram?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-16 sm:mt-20 mb-20 sm:mb-0 rounded-3xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] bg-black/5 dark:bg-white/5 w-full relative overflow-hidden flex flex-col">
            <div className="absolute -bottom-16 -right-16 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-16 -left-16 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative w-full h-28 sm:h-36 md:h-44 overflow-hidden group">
                <Image src={coverSrc} alt="Footer Cover" fill unoptimized
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-cover object-center scale-125 group-hover:scale-130 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/20 to-transparent pointer-events-none" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col gap-6 w-full relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                            <LanguageBlurFadeText enText="Connect with me" idText="Terhubung dengan saya" />
                        </span>
                        <span className="w-8 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent" />
                    </div>
                    <TooltipProvider delay={100}>
                        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                            {MEDIA_SOCIALS_PROFILE.map((social, idx) => (
                                <BlurFade key={social.title} delay={0.2 + idx * 0.05} direction="up">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Link
                                                    href={social.href || "#"}
                                                    target="_blank"
                                                    rel="me noopener"
                                                    className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] bg-transparent hover:bg-black/5 dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group"
                                                    aria-label={social.title}>
                                                    <social.icon className="size-6 sm:size-5 text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                                                </Link>
                                            }
                                        />
                                        <TooltipContent side="top" sideOffset={6}>{social.title}</TooltipContent>
                                    </Tooltip>
                                </BlurFade>
                            ))}
                        </div>
                    </TooltipProvider>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-black/5 dark:border-white/10 text-[11px] sm:text-xs text-muted-foreground font-mono">
                    <p className="text-center sm:text-left">© {currentYear} Personal Portfolio. <LanguageText enText="All rights reserved." idText="Hak cipta dilindungi." /></p>
                    <p className="flex items-center gap-1.5 text-center sm:text-right">
                        <Terminal className="size-3.5 text-primary shrink-0" />
                        <LanguageText enText="Crafted with" idText="Dibuat dengan" />
                        <Heart className="size-3 text-red-500 fill-red-500 inline shrink-0" />
                        <LanguageText enText="&" idText="&" />
                        <Coffee className="size-3.5 text-amber-700 dark:text-amber-500 inline shrink-0" />
                        <LanguageText enText="by" idText="oleh" />
                        <Link
                            href={`${instagram || "#"}`}
                            target="_blank"
                            rel="me noopener"
                            className="font-semibold text-foreground hover:text-primary transition-colors">
                            {name || "Albert Devada"}
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
