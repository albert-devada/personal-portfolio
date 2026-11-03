import type { Metadata } from "next";
import { getCertificateList } from "@/supabase";
import { generateBreadcrumbJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { CertificateCourses } from "@/contents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Certificates",
    description: "Professional certifications, academic credentials, and security achievements",
    alternates: {
        canonical: "/certificate",
    },
};

export default async function CertificatePage() {
    const certificates = await getCertificateList();
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Certificates", url: "/certificate" },
    ]);

    return (
        <Section id="Certificate">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <CertificateCourses 
                isFullPage
                certificates={certificates ?? []} 
            />
        </Section>
    );
}

