import { BlurFade } from "@/components/blurFade";
import CertificationSection from "@/widget/certificateWidget";

const BLUR_FADE_DELAY = 0.03;

export default function CertificatePage() {
    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <CertificationSection isFullPage />
            </BlurFade>
        </main>
    );
}