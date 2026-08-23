import Image from "next/image";
import { Typography } from "@/theme";
import { Avatar } from "./avatarsProfile";
import { MdVerified as VerifiedIcon } from "react-icons/md";

interface ProfileProps {
    avatars?: string | null;
    name?: string | null;
    username?: string | null;
}

export function DisplayProfile({ avatars, name, username }: ProfileProps) {

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

    const displayAvatar = getAvatarSrc(avatars);
    const cleanUser = username?.split('@').filter(Boolean).pop();
    const displayUsername = cleanUser ? `@${cleanUser}` : "@";

    return (
        <div className="w-full lg:hidden">
            <div className="flex flex-row items-center justify-center w-full gap-6 lg:hidden">
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
        </div>
    );
}