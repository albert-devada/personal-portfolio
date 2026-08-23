"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BlurFadeText } from "@/components";
import { getCertificateList } from '@/common/supabase';
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

function formatIssuedDate(dateString: string, lang: "en" | "id" = "en"): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        month: "long",
        year: "numeric",
    });
}

const getLogoSrc = (src: string | null | undefined): string => {
    if (!src) return "/certificate.jpg";

    if (src.startsWith("http://")) {
        return src.replace("http://", "https://");
    }
    
    if (src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }
    
    return `/${src}`;
};

function CertLogoImage({ src, alt }: { src: string | null | undefined; alt: string }) {
    const [imageError, setImageError] = useState(false);
    const logoSrc = getLogoSrc(src);

    if (imageError) {
        return (
            <Image
                src="/certificate.jpg"
                alt={alt}
                width={48}
                height={48}
                className="size-10 sm:size-12 rounded-lg overflow-hidden object-contain flex-none bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/10"
            />
        );
    }

    return (
        <Image
            src={logoSrc}
            alt={alt}
            width={48}
            height={48}
            priority
            className="size-10 sm:size-12 rounded-lg overflow-hidden object-contain flex-none bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/10"
            onError={() => setImageError(true)}
        />
    );
}

type CertificateCoursesItem = Record<string, string | number | boolean | null | undefined>;

interface CertificateCoursesProps {
    isFullPage?: boolean;
}

export function CertificateCourses({ isFullPage = false }: CertificateCoursesProps) {
    const [certifications, setCertifications] = useState<CertificateCoursesItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchCertificates() {
            setIsLoading(true);
            const data = await getCertificateList();
            setCertifications(data || []);
            setIsLoading(false);
        }
        fetchCertificates();
    }, []);

    const itemsPerPage = isFullPage ? 10 : 3;
    const totalPages = Math.ceil(certifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedCertifications = isFullPage ? certifications.slice(startIndex, startIndex + itemsPerPage) : certifications.slice(0, 3);

    return (
        <section id="certifications">
            <div className="flex flex-col gap-y-6 mt-10">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            <LanguageBlurFadeText enText="Achievements" idText="Pencapaian" delay={0.1} />
                            <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent"></span>
                        </div>
                        <div className="text-xl font-bold">
                            <LanguageBlurFadeText 
                                enText={isFullPage ? "Certifications & Courses" : "Latest Certifications"} 
                                idText={isFullPage ? "Sertifikat & Kursus" : "Sertifikat Terbaru"} 
                                delay={0.2} 
                            />
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            {!isLoading && (
                                <LanguageBlurFadeText 
                                    enText={`${certifications.length} professional certifications and completed courses`} 
                                    idText={`${certifications.length} sertifikat profesional dan kursus yang diselesaikan`} 
                                    delay={0.25} 
                                />
                            )}
                        </div>
                    </div>
                    {!isFullPage && certifications.length > 0 && (
                        <Link href="/certificate" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase">
                            <LanguageText enText="View All" idText="Buka" />
                            <ArrowRight className="w-4 h-4" />
                        </Link>
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
                    <div className="p-8 text-center rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground text-sm">
                        <LanguageText enText="Certificates are currently unavailable." idText="Sertifikat belum tersedia saat ini."/>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {displayedCertifications.map((cert, index) => (
                            <Link
                                key={String(cert.id || cert.credential || index)}
                                href={typeof cert.href_url === "string" ? cert.href_url : "#"}
                                target={typeof cert.href_url === "string" && cert.href_url.trim() !== "" ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div className="flex items-center gap-x-4 flex-1 min-w-0">
                                    <CertLogoImage 
                                        src={typeof cert.logo_url === "string" ? cert.logo_url : null} 
                                        alt={String(cert.title || "")} 
                                    />
                                    <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
                                        <div className="font-semibold text-sm sm:text-base leading-none flex items-center gap-2 group">
                                            <BlurFadeText text={String(cert.title || "")} delay={0.3 + index * 0.1} />
                                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                                        </div>
                                        <div className="font-sans text-xs sm:text-sm text-muted-foreground leading-snug mt-1.5">
                                            <LanguageBlurFadeText
                                                enText={`${cert.vendor || ""} • Issued ${formatIssuedDate(String(cert.issued || ""), "en")}`} 
                                                idText={`${cert.vendor || ""} • Diterbitkan ${formatIssuedDate(String(cert.issued || ""), "id")}`} 
                                                delay={0.4 + index * 0.1} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {isFullPage && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-black/5 dark:border-white/10 disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-muted-foreground font-medium">
                            <LanguageText enText="Page" idText="Halaman" /> {currentPage} <LanguageText enText="of" idText="dari" /> {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-black/5 dark:border-white/10 disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}