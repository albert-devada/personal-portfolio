"use client";

import { getBlogList } from "@/common/supabase/client";
import { useState, useEffect, useMemo } from "react";
import { BlurFade } from "@/components/blurFade";
import BlurFadeText from "@/components/blurFadeText";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    X,
    Sparkles,
    Calendar,
    ArrowUpRight,
    BookOpen
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.03;

function formatPublishedDate(dateString: string, lang: "en" | "id" = "en"): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const getBlogImageSrc = (src: string | null | undefined): string => {
    if (!src) return "/blog/no-cover.avif";

    if (src.startsWith("http://")) {
        return src.replace("http://", "https://");
    }

    if (src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }

    return `/blog/${src}`;
};

function PostCardImage({ src, alt }: { src: string | null | undefined; alt: string }) {
    const [imageError, setImageError] = useState(false);
    const blogSrc = getBlogImageSrc(src);

    if (imageError) {
        return (
            <div className="relative w-full h-32 sm:h-36 overflow-hidden rounded-t-xl bg-muted/30">
                <Image
                    src="/blog/no-cover.avif"
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-32 sm:h-36 overflow-hidden rounded-t-xl bg-muted/30">
            <Image
                src={blogSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={() => setImageError(true)}
            />
        </div>
    );
}


type BlogItem = Record<string, string | number | boolean | string[] | null | undefined>;

export default function BlogPage() {
    const { lang } = useLanguage();

    const [posts, setPosts] = useState<BlogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchBlogPosts() {
            setIsLoading(true);
            const data = await getBlogList();
            setPosts((data as BlogItem[]) || []);
            setIsLoading(false);
        }
        fetchBlogPosts();
    }, []);

    const categories = useMemo(() => {
        const catSet = new Set<string>();
        posts.forEach((item) => {
            if (typeof item.category === "string") catSet.add(item.category);
        });
        return ["All", ...Array.from(catSet)];
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const categoryStr = typeof post.category === "string" ? post.category : "";
            const titleEn = typeof post.title_en === "string" ? post.title_en : "";
            const titleId = typeof post.title_id === "string" ? post.title_id : "";
            const summaryEn = typeof post.summary_en === "string" ? post.summary_en : "";
            const summaryId = typeof post.summary_id === "string" ? post.summary_id : "";
            const tagsArr = Array.isArray(post.tags) ? post.tags : [];
            const matchesCategory = selectedCategory === "All" || categoryStr === selectedCategory;
            const matchesSearch =
                searchQuery.trim() === "" ||
                titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                titleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                summaryEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                summaryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tagsArr.some((tag: string) => String(tag).toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        }).sort((a, b) => new Date(String(b.published_at || 0)).getTime() - new Date(String(a.published_at || 0)).getTime());
    }, [posts, searchQuery, selectedCategory]);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <section id="knowledge-blog" className="w-full">
                    <div className="flex flex-col gap-y-6 mt-10">
                        <div className="flex flex-col gap-y-1">
                            <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                <LanguageBlurFadeText enText="Knowledge & Insights" idText="Pengetahuan & Wawasan" delay={0.1} />
                                <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent"></span>
                            </div>
                            <div className="text-xl md:text-2xl font-bold tracking-tight">
                                <LanguageBlurFadeText delay={0.2} 
                                    enText="Programming & Cybersecurity" 
                                    idText="Pemrograman & Keamanan Siber" 
                                />
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                <LanguageBlurFadeText delay={0.25}
                                    enText={`${filteredPosts.length} insights on programming, cybersecurity, and technology`}
                                    idText={`${filteredPosts.length} wawasan seputar pemrograman, keamanan siber, dan teknologi`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3.5 mt-1">
                            <div className="relative w-full sm:w-96 md:w-105 max-w-md mb-3">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder={lang === "id" ? "Cari kategori, topik, atau tag..." : "Search categories, topics, or tags..."}
                                    className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground" />
                                {searchQuery && (
                                    <button onClick={() => handleSearchChange("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {categories.map((cat) => (
                                    <button key={cat} onClick={() => handleCategoryChange(cat)}
                                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer 
                                        ${selectedCategory === cat
                                            ? "bg-foreground text-background shadow-sm"
                                            : "border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
                                        }`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="flex flex-col rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden animate-pulse">
                                        <div className="h-32 sm:h-36 bg-zinc-200 dark:bg-zinc-800 w-full" />
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            </div>
                                            <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="h-4 w-full bg-zinc-200/70 dark:bg-zinc-800/70 rounded" />
                                            <div className="h-4 w-2/3 bg-zinc-200/70 dark:bg-zinc-800/70 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : displayedPosts.length === 0 ? (
                            <div className="p-10 text-center rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
                                <BookOpen className="w-8 h-8 opacity-40 mb-1" />
                                <LanguageText enText="No knowledge articles found matching your query." idText="Tidak ada artikel yang cocok dengan pencarian Anda." />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {displayedPosts.map((post, index) => {
                                    const titleEn = typeof post.title_en === "string" ? post.title_en : "";
                                    const titleId = typeof post.title_id === "string" ? post.title_id : "";
                                    const summaryEn = typeof post.summary_en === "string" ? post.summary_en : "";
                                    const summaryId = typeof post.summary_id === "string" ? post.summary_id : "";
                                    const title = (lang === "id" ? titleId : titleEn) || "";
                                    const summary = (lang === "id" ? summaryId : summaryEn) || "";
                                    const category = typeof post.category === "string" ? post.category : "";
                                    const coverImage = typeof post.cover_image === "string" ? post.cover_image : undefined;
                                    const publishedAt = typeof post.published_at === "string" ? post.published_at : "";
                                    const tags = Array.isArray(post.tags) ? post.tags : [];
                                    const postId = post.id !== undefined && post.id !== null ? String(post.id) : index;

                                    const slug = typeof post.slug === "string" ? post.slug : "";
                                    const cardHref = slug ? `/blog/${slug}` : "#";

                                    return (
                                        <Link key={postId} href={cardHref} className="group flex flex-col justify-between rounded-xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 overflow-hidden cursor-pointer h-full">
                                            <div>
                                                <PostCardImage src={coverImage} alt={title} />
                                                <div className="p-4 flex flex-col gap-2.5">
                                                    <div className="flex items-center text-xs font-mono text-muted-foreground">
                                                        <span
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCategoryChange(category);
                                                            }}
                                                            className="inline-flex items-center gap-1 font-semibold text-primary px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-xs">
                                                            <Sparkles className="w-3 h-3" />
                                                            {category}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors flex items-start justify-between gap-2">
                                                        <BlurFadeText text={title} delay={0.2 + index * 0.05} />
                                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-0.5" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{summary}</p>
                                                    {tags.length > 0 && (
                                                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                                            {tags.map((tag: string) => (
                                                                <span key={tag}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleSearchChange(tag);
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs font-mono text-muted-foreground cursor-pointer">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="px-4 pb-4 pt-3 mt-3 flex items-center justify-between border-t border-black/5 dark:border-white/5 text-[11px] text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        <LanguageText enText="Published " idText="Diterbitkan " />
                                                        {formatPublishedDate(publishedAt, lang)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 font-medium text-xs text-primary group-hover:underline">
                                                    <LanguageText enText="Read More" idText="Baca Selengkapnya" />
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        {!isLoading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-black/5 dark:border-white/10 disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                    <LanguageText enText="Page" idText="Halaman" /> {currentPage} <LanguageText enText="of" idText="dari" /> {totalPages}
                                </span>
                                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-black/5 dark:border-white/10 disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </BlurFade>
        </main>
    );
}
