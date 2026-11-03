"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { ChevronLeft, Calendar, Sparkles, BookOpen, ArrowLeft, ExternalLink, Share2, Check, MessageCircle } from "lucide-react";
import { BlurFade } from "@/components/transition";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/base";
import { LanguageText, useLanguage } from "@/language";
import { formatDate } from "@/utils";
import { getLogoSrc, remarkHtmlBreaks, rehypeHtmlBreaks } from "@/function";
import { Typography } from "@/theme";
import type { ViewPagesProps } from "@/common/types";
import "highlight.js/styles/github-dark.css";

export function BlogArticle({ article, profile }: ViewPagesProps) {
    const { lang } = useLanguage();
    const [copied, setCopied] = useState(false);

    if (!article) {
        return (
            <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center">
                <div className="p-10 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-4">
                    <BookOpen className="w-12 h-12 text-muted-foreground opacity-50" />
                    <Typography.H2 className="text-xl font-bold">
                        <LanguageText enText="Article Not Found" idText="Artikel Tidak Ditemukan" />
                    </Typography.H2>
                    <Typography.P className="text-xs sm:text-sm text-muted-foreground max-w-md">
                        <LanguageText
                            enText="The article you are looking for might have been moved or removed."
                            idText="Artikel yang Anda cari mungkin telah dipindahkan atau dihapus."
                        />
                    </Typography.P>
                    <Link href="/blog" className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                        <ArrowLeft className="w-4 h-4" />
                        <LanguageText enText="Back to Blog" idText="Kembali ke Blog" />
                    </Link>
                </div>
            </div>
        );
    }

    const titleEn = typeof article.title_en === "string" ? article.title_en : "";
    const titleId = typeof article.title_id === "string" ? article.title_id : "";
    const markdownEn = typeof article.markdown_en === "string" ? article.markdown_en : "";
    const markdownId = typeof article.markdown_id === "string" ? article.markdown_id : "";
    const summaryEn = typeof article.summary_en === "string" ? article.summary_en : "";
    const summaryId = typeof article.summary_id === "string" ? article.summary_id : "";
    const title = (lang === "id" ? titleId : titleEn) || titleEn || titleId || "";
    const summary = (lang === "id" ? summaryId : summaryEn) || summaryEn || summaryId || "";
    const rawMarkdownContent = (lang === "id" ? markdownId : markdownEn) || markdownEn || markdownId || "";
    const markdownContent = rawMarkdownContent.replace(/\\n/g, "\n");
    const category = typeof article.category === "string" ? article.category : "";
    const coverImage = typeof article.cover_image === "string" ? article.cover_image : undefined;
    const publishedAt = typeof article.published_at === "string" ? article.published_at : "";
    const tags = Array.isArray(article.tags) ? article.tags : [];
    const authorName = ((typeof article.author_name === "string" && article.author_name) || profile?.display_name) || "";
    const rawUsername = ((typeof article.author_role === "string" && article.author_role) || profile?.username) || "";
    const cleanUser = rawUsername.split("@").filter(Boolean).pop();
    const authorRole = cleanUser ? `@${cleanUser}` : "";
    const authorAvatar = (typeof article.author_avatar === "string" && article.author_avatar) || profile?.photo_url || null;

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success(lang === "id" ? "Tautan artikel berhasil disalin!" : "Article link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleShareNative = async () => {
        if (typeof window !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, text: summary, url: window.location.href });
            } catch {
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    const shareToWhatsApp = () => {
        if (typeof window !== "undefined") {
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + "\n" + window.location.href)}`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const shareToX = () => {
        if (typeof window !== "undefined") {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const shareToLinkedIn = () => {
        if (typeof window !== "undefined") {
            const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pt-4 pb-20 px-4 sm:px-6">
            <BlurFade delay={0.05} inView inViewOnce>
                <div className="mb-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-muted-foreground hover:text-primary hover:-translate-x-1 transition-all duration-200">
                        <ChevronLeft className="w-5 h-5" />
                        <LanguageText enText="Back to all articles" idText="Kembali ke semua artikel" />
                    </Link>
                </div>
                <header className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            {category && (
                                <span className="inline-flex items-center gap-1 font-semibold text-primary px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs font-mono">
                                    <Sparkles className="w-3 h-3" />
                                    {category}
                                </span>
                            )}
                            {publishedAt && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatDate(publishedAt, lang)}</span>
                                </div>
                            )}
                        </div>
                        <TooltipProvider delay={100}>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <button 
                                                onClick={handleShareNative} 
                                                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/20 hover:border-black/20 dark:hover:border-white/30 transition-all duration-200 text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 cursor-pointer">
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 text-primary" />}
                                                <span className="text-foreground">{copied ? (lang === "id" ? "Tersalin!" : "Copied!") : (lang === "id" ? "Bagikan" : "Share")}</span>
                                            </button>
                                        }
                                    />
                                    <TooltipContent side="top" sideOffset={6}>
                                        {lang === "id" ? "Bagikan Artikel" : "Share Article"}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <button 
                                                onClick={shareToWhatsApp} 
                                                className="group p-2 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 hover:border-emerald-500/40 dark:hover:border-emerald-400/50 transition-all duration-200 text-xs hover:scale-105 active:scale-95 cursor-pointer">
                                                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
                                            </button>
                                        }
                                    />
                                    <TooltipContent side="top" sideOffset={6}>
                                        {lang === "id" ? "Bagikan ke WhatsApp" : "Share to WhatsApp"}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <button 
                                                onClick={shareToX} 
                                                className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/15 dark:hover:bg-white/20 hover:border-black/20 dark:hover:border-white/30 transition-all duration-200 text-xs font-bold font-mono hover:scale-105 active:scale-95 cursor-pointer">
                                                <span className="text-foreground">𝕏</span>
                                            </button>
                                        }
                                    />
                                    <TooltipContent side="top" sideOffset={6}>
                                        {lang === "id" ? "Bagikan ke X" : "Share to X"}
                                    </TooltipContent>
                                </Tooltip>   
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <button 
                                                onClick={shareToLinkedIn} 
                                                className="px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 hover:border-blue-500/40 dark:hover:border-blue-400/50 transition-all duration-200 text-xs font-bold hover:scale-105 active:scale-95 cursor-pointer">
                                                <span className="text-[#0A66C2] dark:text-[#378fe9] font-extrabold">in</span>
                                            </button>
                                        }
                                    />
                                    <TooltipContent side="top" sideOffset={6}>
                                        {lang === "id" ? "Bagikan ke LinkedIn" : "Share to LinkedIn"}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                    <Typography.H2 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">{title}</Typography.H2>
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {tags.map((tag) => (
                                <span key={tag} className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-xs font-mono text-muted-foreground">#{tag}</span>
                            ))}
                        </div>
                    )}
                </header>
                {coverImage && (
                    <div className="relative w-full h-44 sm:h-72 md:h-96 rounded-2xl overflow-hidden mb-8 sm:mb-10 border border-black/5 dark:border-white/10 shadow-lg bg-muted/30">
                        <Image
                            src={getLogoSrc(coverImage, "/blog/no-cover.avif", "/blog")}
                            alt={title}
                            fill
                            sizes="(max-width: 1200px) 100vw, 900px"
                            className="object-cover object-center"
                            priority
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.srcset = "/blog/no-cover.avif";
                                target.src = "/blog/no-cover.avif";
                            }}
                        />
                    </div>
                )}
                <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none wrap-break-word prose-p:leading-relaxed prose-p:my-3 sm:prose-p:my-4 prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-6 sm:prose-headings:mt-8 prose-headings:mb-3 sm:prose-headings:mb-4 prose-ul:my-3 sm:prose-ul:my-4 prose-li:my-1 prose-bullets:text-primary dark:prose-bullets:text-primary prose-strong:text-foreground prose-strong:font-bold prose-img:rounded-xl prose-hr:my-6 sm:prose-hr:my-8 prose-hr:border-black/10 dark:prose-hr:border-white/10 prose-pre:rounded-xl prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10 [&_pre]:bg-zinc-950! dark:[&_pre]:bg-zinc-900/80! [&_.hljs]:bg-transparent!">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkHtmlBreaks]}
                        rehypePlugins={[rehypeHighlight, rehypeHtmlBreaks]}
                        components={{
                            ul: ({ children, ...props }) => (
                                <ul className="my-3 sm:my-4 space-y-1.5 pl-5 list-disc marker:text-primary marker:font-bold" {...props}>
                                    {children}
                                </ul>
                            ),
                            ol: ({ children, ...props }) => (
                                <ol className="my-3 sm:my-4 space-y-1.5 pl-5 list-decimal marker:text-primary marker:font-bold" {...props}>
                                    {children}
                                </ol>
                            ),
                            li: ({ children, ...props }) => (
                                <li className="leading-relaxed text-foreground" {...props}>
                                    {children}
                                </li>
                            ),
                            strong: ({ children, ...props }) => (
                                <strong className="font-bold text-foreground" {...props}>
                                    {children}
                                </strong>
                            ),
                            a: ({ href, children, ...props }) => {
                                const isExternal = href?.startsWith("http");
                                return (
                                    <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}
                                        className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary hover:text-primary/80 transition-all duration-200 wrap-break-word"
                                        {...props}>
                                        {children}
                                        {isExternal && <ExternalLink className="w-3.5 h-3.5 inline-block opacity-75 shrink-0" />}
                                    </a>
                                );
                            },
                            code: ({ className, children, ...props }) => {
                                const isInline = !className || !className.includes("hljs");
                                if (isInline) {
                                    return (
                                        <code className="inline-block whitespace-nowrap max-w-full overflow-x-auto align-middle px-1.5 py-0.5 mx-0.5 rounded-md font-mono text-[0.8em] sm:text-[0.85em] bg-primary/10 border border-primary/20 text-primary font-semibold tracking-tight"
                                            {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}>
                        {markdownContent}
                    </ReactMarkdown>
                </article>
                <div className="mt-12 p-5 sm:p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-linear-to-br from-black/3 to-black/1 dark:from-white/4 dark:to-white/1 backdrop-blur-md flex flex-col gap-4 shadow-sm transition-all hover:border-primary/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-primary/30 bg-muted shrink-0 shadow-xs">
                                <Image 
                                    src={getLogoSrc(authorAvatar, "/assets/avatar.jpeg")} 
                                    alt={authorName} 
                                    fill 
                                    sizes="(max-width: 640px) 48px, 56px" 
                                    className="object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.srcset = "/assets/avatar.jpeg";
                                        target.src = "/assets/avatar.jpeg";
                                    }}
                                />
                            </div>
                            <div className="flex flex-col items-start gap-1 min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Typography.Text className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                                        {authorName}
                                    </Typography.Text>
                                    <VerifiedIcon size={18} className="text-blue-400 shrink-0" />
                                </div>
                                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{authorRole}</span>
                            </div>
                        </div>
                        <button onClick={handleCopyLink}
                            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs font-mono text-muted-foreground flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5 text-primary" />}
                            <span>{copied ? "Copied" : "Copy Link"}</span>
                        </button>
                    </div>
                    <Typography.P className="text-xs text-muted-foreground leading-relaxed">
                        <LanguageText
                            enText={summaryEn}
                            idText={summaryId}
                        />
                    </Typography.P>
                </div>
            </BlurFade>
        </div>
    );
}
