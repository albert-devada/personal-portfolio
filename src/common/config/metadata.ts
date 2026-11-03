import type { Metadata, Viewport } from "next";
import type { ArticleMetadataProps } from "@/common/types";
import { Config } from "./config";
import { AuthorData } from "./author";

export const defaultTitle = `${AuthorData.displayName} Official ${Config.AppName} | ${AuthorData.jobTitle}`;
export const defaultDescription = `Official portfolio of ${AuthorData.displayName} (${AuthorData.nickname}) — ${AuthorData.jobTitle} exploring software engineering, security research, and continuous learning.`;

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    themeColor: "#0f172a",
};

export const defaultMetadata: Metadata = {
    metadataBase: new URL(Config.WebUrl),
    title: {
        default: defaultTitle,
        template: `%s | ${AuthorData.displayName} Portfolio`,
    },
    description: defaultDescription,
    abstract: defaultDescription,
    category: "Technology & Cybersecurity",
    alternates: {
        canonical: "./",
        types: {
            "application/rss+xml": "/feed.xml",
        },
    },
    keywords: [
        "Albert Devada",
        "albertdevada",
        "Naufal Burhanuddin Yusuf",
        "Naufal Burhan",
        "Naufal Burhanuddin",
        "Albert Devada Naufal Burhan",
        "Naufal Burhan Albert Devada",
        "Albert Devada (Naufal Burhan)",
        "Albert Devada Portfolio",
        "Albert Devada Resume",
        "Albert Devada CV",
        "Albert Devada Website",
        "albertdevada portfolio",
        "Naufal Burhan Portfolio",
        "Naufal Burhan Resume",
        "Naufal Burhan CV",
        "Naufal Burhanuddin Yusuf Portfolio",
        "Personal Portfolio",
        "Backend Developer",
        "Software Engineer",
        "Full Stack Developer",
        "DevOps Engineer",
        "DevSecOps",
        "Albert Devada Backend Developer",
        "Naufal Burhan Backend Developer",
        "Security Researcher",
        "Penetration Tester",
        "Ethical Hacker",
        "Bug Hunter",
        "Web Application Security",
        "Cybersecurity Specialist",
        "Albert Devada Security Researcher",
        "Naufal Burhan Security Researcher",
        "Backend Developer Indonesia",
        "Penetration Tester Indonesia",
        "Security Researcher Indonesia",
        "Indonesia Cybersecurity",
    ],
    creator: AuthorData.name,
    authors: [
        {
            name: AuthorData.name,
            url: Config.WebUrl,
        },
    ],
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: Config.WebUrl,
        type: "website",
        locale: "en_US",
        siteName: Config.AppName,
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDescription,
        images: ["/og-image.png"],
    },
    other: {
        audience: "all",
        coverage: "Worldwide",
        rating: "General",
        "content-language": "en",
        "msapplication-TileColor": "#0f172a",
        "apple-mobile-web-app-title": Config.AppName,
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/site.webmanifest",
};

export const defaultJsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${Config.WebUrl}/#website`,
            url: Config.WebUrl,
            name: `${AuthorData.displayName} Portfolio`,
            alternateName: [
                AuthorData.name,
                AuthorData.nickname,
                "albertdevada",
                "naufalburhan",
            ],
            description: defaultDescription,
            publisher: {
                "@type": "Person",
                "@id": `${Config.WebUrl}/#person`,
                name: AuthorData.name,
                alternateName: AuthorData.nickname,
                jobTitle: AuthorData.jobTitle,
                url: Config.WebUrl,
                sameAs: [
                    AuthorData.github,
                    AuthorData.linkedin,
                    AuthorData.instagram,
                    AuthorData.hackerone,
                ].filter(Boolean) as string[],
            },
            inLanguage: "en-US",
        },
        {
            "@type": "WebApplication",
            "@id": `${Config.WebUrl}/#webapp`,
            name: `${AuthorData.displayName} Official ${Config.AppName} | ${AuthorData.jobTitle}`,
            url: Config.WebUrl,
            applicationCategory: "DeveloperApplication",
            applicationSubCategory: "Personal Portfolio, Software Engineering & Cybersecurity Platform",
            operatingSystem: "All (Web-based)",
            browserRequirements: "Requires modern web browser with HTML5 and JavaScript enabled",
            description: defaultDescription,
            features: [
                "Interactive Linux Terminal Emulator with Custom Commands",
                "Cybersecurity Tools (Breach Checker, CVE Tracker, CISA KEV)",
                "Developer & Network Utilities (Encoder/Decoder, IP Geolocation, JSON Formatter, Server Status Monitor)",
                "Exchange Rate & Financial Market Watch Tracker",
                "Multi-Language Support (English & Indonesian)",
                "Interactive Background Music Player Widget",
                "Theme Switcher with Dark Mode and Light Mode",
                "Developer Projects, Certifications & Technical Blog Showcase",
                "Bot & Form Protection with Cloudflare Turnstile",
            ],
            author: {
                "@id": `${Config.WebUrl}/#person`,
            },
        },
        {
            "@type": "ItemList",
            "@id": `${Config.WebUrl}/#sitenavigation`,
            name: "Main Navigation",
            description: "Primary site navigation elements for Albert Devada Portfolio",
            itemListElement: [
                {
                    "@type": "SiteNavigationElement",
                    position: 1,
                    name: "Home",
                    description: "Official software engineering and cybersecurity portfolio of Albert Devada",
                    url: `${Config.WebUrl}/`,
                },
                {
                    "@type": "SiteNavigationElement",
                    position: 2,
                    name: "Certificate",
                    description: "Professional certifications, academic credentials, and security achievements",
                    url: `${Config.WebUrl}/certificate`,
                },
                {
                    "@type": "SiteNavigationElement",
                    position: 3,
                    name: "Experience",
                    description: "Showcase of software engineering projects, client apps, and security tools",
                    url: `${Config.WebUrl}/project`,
                },
                {
                    "@type": "SiteNavigationElement",
                    position: 4,
                    name: "Tech Insights",
                    description: "Technical articles, cybersecurity writeups, and software development insights",
                    url: `${Config.WebUrl}/blog`,
                },
                {
                    "@type": "SiteNavigationElement",
                    position: 5,
                    name: "AI Assistant",
                    description: "Interactive AI assistant trained on portfolio projects and cybersecurity insights",
                    url: `${Config.WebUrl}/chat`,
                },
                {
                    "@type": "SiteNavigationElement",
                    position: 6,
                    name: "Playground",
                    description: "Interactive security tools: CVE Tracker, CISA KEV exploits, and live feeds",
                    url: `${Config.WebUrl}/playground`,
                },
            ],
        },
    ],
};

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${Config.WebUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
        })),
    };
}

export function generateArticleMetadata(article: ArticleMetadataProps | Record<string, unknown> | null, slug: string): Metadata {
    if (!article) {
        return {
            title: "Article Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = (article.title_en || article.title_id || "Article") as string;
    const description = (article.summary_en || article.summary_id || "") as string;
    const category = (article.category as string) || "Technology";
    const tags = Array.isArray(article.tags) ? (article.tags as string[]) : [];
    const authorName = (article.author_name as string) || AuthorData.name;
    const cover = typeof article.cover_image === "string" ? article.cover_image : null;
    const imageUrl = cover
        ? cover.startsWith("http") || cover.startsWith("/")
            ? cover
            : `/blog/${cover}`
        : "/blog/no-cover.avif";

    const defaultKeywords = Array.isArray(defaultMetadata.keywords)
        ? (defaultMetadata.keywords as string[])
        : [];

    return {
        title,
        description,
        abstract: description,
        category,
        keywords: [
            ...tags,
            category,
            "Technical Blog",
            "Article",
            "Blog Post",
            "Software Engineering",
            "Cybersecurity",
            AuthorData.name,
            AuthorData.displayName,
            ...defaultKeywords,
        ],
        authors: [
            {
                name: authorName,
                url: Config.WebUrl,
            },
        ],
        creator: authorName,
        publisher: AuthorData.displayName,
        robots: defaultMetadata.robots,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: `/blog/${slug}`,
            siteName: Config.AppName,
            locale: "en_US",
            publishedTime: article.published_at ? String(article.published_at) : undefined,
            modifiedTime: article.updated_at ? String(article.updated_at) : undefined,
            authors: [authorName],
            section: category,
            tags,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: AuthorData.username,
            images: [imageUrl],
        },
        other: {
            ...defaultMetadata.other,
            "article:published_time": article.published_at ? String(article.published_at) : "",
            "article:author": authorName,
            "article:section": category,
            "article:tag": tags.join(", "),
        },
    };
}

export function generateArticleJsonLd(article: ArticleMetadataProps | Record<string, unknown>, slug: string) {
    const title = (article.title_en || article.title_id || "Article") as string;
    const description = (article.summary_en || article.summary_id || "") as string;
    const category = (article.category as string) || "Technology";
    const tags = Array.isArray(article.tags) ? (article.tags as string[]) : [];
    const authorName = (article.author_name as string) || AuthorData.name;
    const cover = typeof article.cover_image === "string" ? article.cover_image : null;
    const imageUrl = cover
        ? cover.startsWith("http") || cover.startsWith("/")
            ? cover
            : `/blog/${cover}`
        : "/blog/no-cover.avif";
    const absoluteImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `${Config.WebUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: `${Config.WebUrl}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Tech Insights",
                        item: `${Config.WebUrl}/blog`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: title,
                        item: `${Config.WebUrl}/blog/${slug}`,
                    },
                ],
            },
            {
                "@type": "BlogPosting",
                headline: title,
                description,
                image: [absoluteImageUrl],
                datePublished: article.published_at ? String(article.published_at) : undefined,
                dateModified: article.updated_at
                    ? String(article.updated_at)
                    : article.published_at
                    ? String(article.published_at)
                    : undefined,
                inLanguage: "en-US",
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${Config.WebUrl}/blog/${slug}`,
                },
                author: {
                    "@type": "Person",
                    name: authorName,
                    alternateName: AuthorData.nickname,
                    jobTitle: AuthorData.jobTitle,
                    url: Config.WebUrl,
                    homeLocation: {
                        "@type": "Place",
                        name: AuthorData.location,
                    },
                    sameAs: [
                        AuthorData.github,
                        AuthorData.linkedin,
                        AuthorData.instagram,
                        AuthorData.hackerone,
                    ].filter(Boolean) as string[],
                },
                publisher: {
                    "@type": "Person",
                    name: AuthorData.displayName,
                    url: Config.WebUrl,
                },
                keywords: [
                    ...tags,
                    category,
                    AuthorData.displayName,
                    AuthorData.name,
                ].join(", "),
                articleSection: category,
            },
        ],
    };
}

