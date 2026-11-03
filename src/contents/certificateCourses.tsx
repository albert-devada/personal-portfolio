"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BlurFade } from "@/components/transition";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "@/utils";
import { Button } from "@/components/base";
import { getLogoSrc } from "@/function";
import { Typography } from "@/theme";
import type { ViewPagesProps } from "@/common/types";

export function CertificateCourses({ certificates: propCertificates, isFullPage = false }: ViewPagesProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const isLoading = propCertificates === undefined;
    const certifications = propCertificates ?? [];
    const itemsPerPage = isFullPage ? 10 : 3;
    const totalPages = Math.ceil(certifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedCertifications = isFullPage ? certifications.slice(startIndex, startIndex + itemsPerPage) : certifications.slice(0, 3);

    return (
        <div className="flex flex-col gap-y-6 mt-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-1">
                    <Typography.MonoText className="flex items-center gap-3 w-fit font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        <LanguageBlurFadeText enText="Achievements" idText="Pencapaian" delay={0.15} className="w-auto" />
                        <BlurFade delay={0.2} inView inViewOnce className="shrink-0">
                            <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent block"></span>
                        </BlurFade>
                    </Typography.MonoText>
                    <Typography.CardTitle className="text-xl font-bold">
                        <LanguageBlurFadeText 
                            enText={isFullPage ? "Certifications & Courses" : "Latest Certifications"} 
                            idText={isFullPage ? "Sertifikat & Kursus" : "Sertifikat Terbaru"} 
                            delay={0.2} 
                        />
                    </Typography.CardTitle>
                    <Typography.P className="text-xs sm:text-sm text-muted-foreground">
                        {!isLoading && (
                            <LanguageBlurFadeText 
                                enText={`${certifications.length} professional certifications and completed courses`} 
                                idText={`${certifications.length} sertifikat profesional dan kursus yang diselesaikan`} 
                                delay={0.25} 
                            />
                        )}
                    </Typography.P>
                </div>
                {!isFullPage && certifications.length > 0 && (
                    <BlurFade delay={0.3} inView inViewOnce>
                        <Typography.MonoText>
                            <Link href="/certificate" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase">
                                <LanguageText enText="View All" idText="Buka" />
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Typography.MonoText>
                    </BlurFade>
                )}
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: isFullPage ? 5 : 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 animate-pulse">
                            <div className="size-10 sm:size-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                                <div className="h-3 w-1/3 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : certifications.length === 0 ? (
                <Typography.MonoText className="p-8 text-center rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground text-sm">
                    <LanguageText enText="Certificates are currently unavailable." idText="Sertifikat belum tersedia saat ini."/>
                </Typography.MonoText>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {displayedCertifications.map((cert, index) => {
                        const cardDelay = 0.1 + index * 0.25;
                        return (
                            <BlurFade key={String(cert.id || cert.credential || index)} delay={cardDelay} inView>
                                <Link
                                    href={typeof cert.href_url === "string" ? cert.href_url : "#"}
                                    target={typeof cert.href_url === "string" && cert.href_url.trim() !== "" ? "_blank" : "_self"}
                                    rel="nofollow noopener noreferrer"
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-x-4 flex-1 min-w-0">
                                        <Image 
                                            src={getLogoSrc(typeof cert.logo_url === "string" ? cert.logo_url : null, "/certificate.jpg")} 
                                            alt={String(cert.title || "")} 
                                            width={48} 
                                            height={48} 
                                            priority 
                                            className="size-10 sm:size-12 rounded-lg overflow-hidden object-contain flex-none bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/10" 
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                target.srcset = "/certificate.jpg";
                                                target.src = "/certificate.jpg";
                                            }}
                                        />
                                        <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
                                            <div className="font-semibold text-sm sm:text-base leading-none flex items-center gap-2 group">
                                                <Typography.Text className="truncate">
                                                    {String(cert.title || "")}
                                                </Typography.Text>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                                            </div>
                                            <div className="font-sans text-xs sm:text-sm text-muted-foreground leading-snug">
                                                <LanguageText
                                                    enText={`${cert.vendor || ""} • Issued ${formatMonthYear(String(cert.issued || ""), "en")}`} 
                                                    idText={`${cert.vendor || ""} • Diterbitkan ${formatMonthYear(String(cert.issued || ""), "id")}`} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </BlurFade>
                        );
                    })}
                </div>
            )}
            {isFullPage && totalPages > 1 && (
                <BlurFade delay={0.4} inView inViewOnce>
                    <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                            className="rounded-lg border-black/5 dark:border-white/10 cursor-pointer">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                            <LanguageText enText="Page" idText="Halaman" /> {currentPage} <LanguageText enText="of" idText="dari" /> {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                            className="rounded-lg border-black/5 dark:border-white/10 cursor-pointer">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </BlurFade>
            )}
        </div>
    );
}