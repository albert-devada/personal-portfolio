import Link from "next/link";
import { MediaSocials } from "@/lib";
import { DisplayProfile } from "@/partial";
import { getVisitorDetails } from "@/common/service";
import { getPersonalProfile } from '@/common/supabase';
import { TerminalWidget, WorkSection } from "@/widget";
import { LanguageText, LanguageBlurFadeText } from "@/language";
import { CertificateCourses, ProjectExperience } from "@/contents";
import { MapPin, Brain, ArrowRight, ArrowUpRight } from "lucide-react";
import { BlurFade, ResumeDowload, TypingAnimation, InteractiveHoverButton } from "@/components";

const BLUR_FADE_DELAY = 0.03;
export const dynamic = "force-dynamic";

export default async function Home() {
    
    const { ipAddress, GeoLocationData } = await getVisitorDetails(true);
    const profile = await getPersonalProfile();
    const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(profile.location)}`;
    
    return (
        <div className="pt-13 md:pt-0">
            <DisplayProfile avatars={profile.photo_url} name={profile.display_name} username={profile.username} />
            <div className="w-full flex-1 pt-8 md:pt-10">
                <BlurFade delay={BLUR_FADE_DELAY} offset={8} className="flex items-center gap-2">
                    <TypingAnimation 
                        words={profile.title}
                        blinkCursor={true}
                        pauseDelay={3000}
                        loop={true}
                        cursorStyle="line"
                        className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shine bg-linear-to-l from-neutral-800 via-slate-500/80 to-neutral-700 dark:from-slate-200/80 dark:via-neutral-600 dark:to-slate-200/80"
                    />
                </BlurFade>
                <LanguageBlurFadeText delay={BLUR_FADE_DELAY} 
                    enText={profile.description_en}
                    idText={profile.description_id}
                    className="text-sm md:text-[17px] leading-relaxed font-medium mt-3 text-slate-800/80 dark:text-slate-200/80 block"
                />
                <div className="flex flex-row items-center gap-2.5 mt-5 w-full">
                    <BlurFade delay={BLUR_FADE_DELAY * 2} direction="left" className="flex-1 sm:flex-none w-full sm:w-auto">
                        <Link href="/blog" className="block w-full sm:inline-block sm:w-auto">
                            <InteractiveHoverButton 
                                icon={<Brain className="w-3.5 h-3.5" />}
                                hoverIcon={<ArrowRight className="w-3.5 h-3.5" />}
                                className="w-full sm:w-auto bg-transparent backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300">
                                <LanguageText enText="My Knowledge" idText="Pengetahuan Saya" />
                            </InteractiveHoverButton>
                        </Link>
                    </BlurFade>
                    <BlurFade delay={BLUR_FADE_DELAY * 3} direction="left" className="flex-1 sm:flex-none w-full sm:w-auto">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full sm:inline-block sm:w-auto">
                            <InteractiveHoverButton 
                                icon={<MapPin className="w-3.5 h-3.5" />}
                                hoverIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                                className="w-full sm:w-auto bg-transparent backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.15)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black transition-all duration-300">
                                {profile.location}
                            </InteractiveHoverButton>
                        </a>
                    </BlurFade>
                </div>
                <BlurFade delay={0.5} className="mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                        <div className="flex items-center gap-3 shrink-0">
                            <LanguageBlurFadeText
                                enText="Find me on"
                                idText="Temukan Saya"
                                delay={BLUR_FADE_DELAY * 2}
                                className="text-xs md:text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-zinc-500 to-zinc-900 dark:from-zinc-400 dark:to-zinc-100"
                            />
                            <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent"></span>
                        </div>
                        <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between w-full sm:w-auto sm:flex-1 gap-5 sm:gap-4">
                            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                                {MediaSocials.map((social, idx) => (
                                    <BlurFade key={social.title} delay={0.6 + idx * 0.05} direction="up">
                                        <Link
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-2xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] bg-transparent hover:bg-black/5 dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group"
                                            title={social.title}>
                                            <social.icon className="size-6 sm:size-5 text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                                        </Link>
                                    </BlurFade>
                                ))}
                            </div>
                            <div className="shrink-0 w-full min-[480px]:w-auto mt-1 min-[480px]:mt-0">
                                <BlurFade delay={BLUR_FADE_DELAY * 3} direction="left" className="w-full">
                                    <ResumeDowload portfolioUrl={profile.portfolio_url} />
                                </BlurFade>
                            </div>
                        </div>
                    </div>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 5} className="mt-8">
                    <TerminalWidget visitorIp={ipAddress} geoData={GeoLocationData} />
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 6}>
                    <CertificateCourses />
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 8}>
                    <WorkSection />
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 7}>
                    <ProjectExperience />
                </BlurFade>
            </div>
        </div>
    );
}