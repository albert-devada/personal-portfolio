import { Config } from "@/common/config";
import { getBlogList } from "@/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    const today = new Date().toISOString().split("T")[0];
    const blogs = await getBlogList();
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${Config.WebUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${Config.WebUrl}/certificate</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${Config.WebUrl}/project</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${Config.WebUrl}/blog</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${Config.WebUrl}/chat</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${Config.WebUrl}/playground</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
${(blogs || []).filter((b) => b && typeof b.slug === "string" && b.slug.trim().length > 0).map((b) => {
        const lastmod = b.updated_at ? String(b.updated_at).split("T")[0] : b.published_at ? String(b.published_at).split("T")[0] : today;
        return `    <url>
        <loc>${Config.WebUrl}/blog/${encodeURIComponent(String(b.slug))}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;}).join("\n")}
</urlset>
`;

    return new Response(content, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
        },
    });
}

