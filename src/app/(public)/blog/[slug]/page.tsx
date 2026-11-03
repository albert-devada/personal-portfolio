import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getPersonalProfile } from "@/supabase";
import { generateArticleMetadata, generateArticleJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { BlogArticle } from "@/contents";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getBlogBySlug(slug);
    return generateArticleMetadata(article, slug);
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [profile, article] = await Promise.all([
        getPersonalProfile(),
        getBlogBySlug(slug),
    ]);

    if (!article) {
        notFound();
    }

    const jsonLdArticle = generateArticleJsonLd(article, slug);

    return (
        <Section id="BlogArticle">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
            />
            <BlogArticle 
                article={article} 
                profile={profile} 
            />
        </Section>
    );
}