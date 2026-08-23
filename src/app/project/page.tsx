import type { Metadata } from "next";
import { BlurFade } from "@/components";
import { ProjectExperience } from "@/contents";

const BLUR_FADE_DELAY = 0.03;

export const metadata: Metadata = {
    title: "Experience",
    description: "In my daily activities, I enjoy developing personal applications, handling freelance projects, and building software for clients.",
    alternates: {
        canonical: "/project",
    },
};

export default function ProjectPage() {
    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <ProjectExperience isFullPage />
            </BlurFade>
        </main>
    );
}