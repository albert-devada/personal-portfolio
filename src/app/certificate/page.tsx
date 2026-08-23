import type { Metadata } from "next";
import { BlurFade } from "@/components";
import { CertificateCourses } from "@/contents";

const BLUR_FADE_DELAY = 0.03;

export const metadata: Metadata = {
    title: "Certificates",
    description: "I am constantly learning and acquiring new knowledge and skills, which is proven by the various certifications and awards I have received.",
    alternates: {
        canonical: "/certificate",
    },
};

export default function CertificatePage() {
    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <CertificateCourses isFullPage />
            </BlurFade>
        </main>
    );
}