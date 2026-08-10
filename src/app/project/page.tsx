import { BlurFade } from "@/components/blurFade";
import ExperienceSection from "@/widget/experienceWidget";

const BLUR_FADE_DELAY = 0.03;

export default function ProjectPage() {
    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <ExperienceSection isFullPage />
            </BlurFade>
        </main>
    );
}