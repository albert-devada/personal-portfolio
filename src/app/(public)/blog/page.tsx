import type { Metadata } from "next";
import { getBlogList } from "@/supabase";
import { generateBreadcrumbJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { BlogInsights } from "@/contents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Technology Insights",
    description: "Technical articles, cybersecurity writeups, and software development insights",
    alternates: {
        canonical: "/blog",
    },
};

export default async function BlogPage() {
    const blogs = await getBlogList();
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Tech Insights", url: "/blog" },
    ]);

    return (
        <Section id="Blog">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <BlogInsights 
                blogs={blogs ?? []} 
            />
        </Section>
    );
}