"use client";

import Image from "next/image";
import { Typography } from "@/theme";
import { Avatar } from "@/components/base";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { getAvatarSrc, formatDisplayUsername } from "@/function";
import type { ProfileAvatarsProps } from "@/common/types";
import { BlurFade } from "@/components/transition";
import { cn } from "@/utils";

export function DisplayProfile({ avatars, name, username, className }: ProfileAvatarsProps) {
    const displayAvatar = getAvatarSrc(avatars);
    const displayUsername = formatDisplayUsername(username);

    return (
        <div className={cn("w-full lg:hidden", className)}>
            <BlurFade
                delay={0.50}
                offset={15}
                duration={1.15}
                direction="down"
                className="w-full">
                <div className="flex flex-row items-center justify-center w-full gap-6">
                    <div className="relative shrink-0">
                        <Avatar className="w-25 h-25 sm:w-30 sm:h-30 shadow-md transition-transform duration-300">
                            <Image 
                                priority
                                height={200} 
                                width={200} 
                                alt={name?.toLowerCase().replace(/\s+/g, '') || "avatars"}
                                src={displayAvatar}
                                draggable="false" 
                                className="object-cover w-full h-full rounded-full"
                            />
                        </Avatar>
                    </div>
                    <div className="flex flex-col items-start justify-center space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Typography.H4 className="text-[22px] font-bold text-black dark:text-white tracking-tight font-sans">{name}</Typography.H4>
                            <VerifiedIcon size={24} className="text-blue-400" />
                        </div>
                        <Typography.P className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400 tracking-normal font-sans">{displayUsername}</Typography.P>
                    </div>
                </div>
            </BlurFade>
        </div>
    );
}