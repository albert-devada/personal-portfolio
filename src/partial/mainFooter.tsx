"use client";

import Link from "next/link";
import Image from "next/image";

import { MediaSocials } from "@/lib";
import { LanguageText } from "@/language";
import { MetadataConstants } from "@/common/constants";
import { Terminal, Heart, Coffee } from "lucide-react";

interface FooterProps {
    coverSrc?: string;
}

export function MainFooter({ coverSrc = "/cover.gif" }: FooterProps) {
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
                            <LanguageText enText="Connect with me" idText="Terhubung dengan saya" />
                        </span>
                        <span className="w-8 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent" />
                    </div>
                    <div className="flex items-center gap-3">
                        {MediaSocials.map((social) => {
                            const IconComponent = social.icon;
                            return (
                                <Link key={social.title} href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.title}
                                    className="p-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 shadow-xs">
                                    <IconComponent className="size-4" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-black/5 dark:border-white/10 text-[11px] sm:text-xs text-muted-foreground font-mono">
                    <p className="text-center sm:text-left">© {currentYear} Personal Portfolio. <LanguageText enText="All rights reserved." idText="Hak cipta dilindungi." /></p>
                    <p className="flex items-center gap-1.5 text-center sm:text-right">
                        <Terminal className="size-3.5 text-primary shrink-0" />
                        <LanguageText enText="Crafted with" idText="Dibuat dengan" />
                        <Heart className="size-3 text-red-500 fill-red-500 inline shrink-0" />
                        <LanguageText enText="&" idText="&" />
                        <Coffee className="size-3.5 text-amber-700 dark:text-amber-500 inline shrink-0" />
                        <LanguageText enText={`by ${MetadataConstants.authors.displayName}`} idText={`oleh ${MetadataConstants.authors.displayName}`} />
                    </p>
                </div>
            </div>
        </footer>
    );
}
