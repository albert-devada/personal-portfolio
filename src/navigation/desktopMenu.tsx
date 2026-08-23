"use client";

import { getPersonalProfile } from '@/common/supabase/client';
import { navigationMenu } from "@/lib/navigation";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { ChevronRight } from "lucide-react";
import { BlurFade } from "@/components/blurFade";
import { LanguageText } from "@/language/languageTranslate";
import { Avatar } from "@/partial/avatarsProfile";
import { MusicWidget } from "@/widget/musicWidget";
import Link from "next/link";
import Image from "next/image";
import Typography from "@/theme/typography";

interface DesktopMenuProps {
    pathname: string;
}

const profile = await getPersonalProfile();

export const DesktopMenu = ({ pathname }: DesktopMenuProps) => {
    
    const getAvatarSrc = (src: string | null | undefined): string => {
        if (!src) return "/assets/avatar.jpeg";

        if (src.startsWith("http://")) {
            return src.replace("http://", "https://");
        }
        
        if (src.startsWith("https://") || src.startsWith("/")) {
            return src;
        }
        
        return `/${src}`;
    };

    const displayAvatar = getAvatarSrc(profile.photo_url);
    const cleanUser = profile.username?.split('@').filter(Boolean).pop();
    const displayUsername = cleanUser ? `@${cleanUser}` : "@";

    return (
        <BlurFade delay={0.8} direction="right">
            <aside className={`
                hidden lg:flex flex-col sticky top-16 w-72 lg:w-70 max-h-[calc(100vh-4rem)] overflow-y-auto px-3 pt-4 pb-24 z-50 
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none
                [@media(max-height:740px)]:[-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] 
                [@media(max-height:740px)]:mask-[linear-gradient(to_bottom,black_85%,transparent_100%)]`}>
                <div className="mb-6 px-1 flex flex-col items-center text-center mt-2">
                    <div className="relative">
                        <Avatar className={`w-32 h-32 mb-4 shadow-md transition-transform duration-300`}>
                            <Image 
                                priority 
                                height={200} 
                                width={200} 
                                alt={profile.display_name.toLowerCase().replace(/\s+/g, '')}
                                src={displayAvatar}
                                draggable="false"
                            />
                        </Avatar>
                    </div>
                    <div className="space-y-1 flex flex-col items-center w-full">
                        <div className="relative inline-flex items-center justify-center">
                            <Typography.H4 className="text-[22px] font-bold text-black dark:text-white tracking-tight font-sans text-center">{profile.display_name}</Typography.H4>
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                                <VerifiedIcon size={24} className="text-blue-400" />
                            </div>
                        </div>
                        <Typography.P className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400 tracking-normal font-sans text-center">{displayUsername}</Typography.P>
                    </div>
                </div>
                <MusicWidget className="mt-3 mb-10 mx-1 bg-white/60 dark:bg-white/5" />
                <nav className="flex flex-col space-y-4 px-0 w-full">
                    {navigationMenu.map((group, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col w-full items-start">
                            {(group.groupLabelEn || group.groupLabelId) && (
                                <Typography.P className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 px-3 mt-4">
                                    <LanguageText 
                                        enText={group.groupLabelEn ?? ""} 
                                        idText={group.groupLabelId ?? ""} 
                                    />
                                </Typography.P>
                            )}
                            <div className="flex flex-col space-y-1 w-full">
                                {group.menus.map((menu, menuIndex) => {
                                    const Icon = menu.icon;
                                    const isActive = pathname === menu.href || (menu.href !== '/' && pathname.startsWith(menu.href));

                                    return (
                                        <Link href={menu.href} key={menuIndex} className="w-full">
                                            <div className={`
                                                flex flex-row items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer w-full
                                                ${isActive 
                                                    ? "bg-black/5 dark:bg-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_15px_rgba(255,255,255,0.05)] text-black dark:text-white" 
                                                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 hover:text-black dark:hover:text-white"
                                                }`}>
                                                <div className="flex flex-row items-center overflow-hidden">
                                                    <Icon className={`w-5 h-5 mr-3 shrink-0 transition-colors ${isActive ? "text-blue-500 dark:text-blue-400" : ""}`} />
                                                    <span className="text-[14px] font-semibold font-sans truncate">
                                                        <LanguageText 
                                                            enText={menu.labelEn} 
                                                            idText={menu.labelId} 
                                                        />
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <ChevronRight className="w-4 h-4 text-black/40 dark:text-white/40 shrink-0 ml-2" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </BlurFade>
    );
};