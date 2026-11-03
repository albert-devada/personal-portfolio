import type { Metadata } from "next";
import { getExperienceList } from "@/supabase";
import { generateBreadcrumbJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { ProjectExperience } from "@/contents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Experience",
    description: "Showcase of software engineering projects, client apps, and security tools",
    alternates: {
        canonical: "/project",
    },
};

export default async function ProjectPage() {
    const experiences = await getExperienceList();
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Experience", url: "/project" },
    ]);

    return (
        <Section id="Project">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProjectExperience 
                isFullPage
                experiences={experiences ?? []} 
            />
        </Section>
    );
}


