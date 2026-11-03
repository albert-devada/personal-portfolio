import { AUTHOR_PROFILE_DATA } from "@/common/constants";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavigationItems {
    groupLabelEn?: string;
    groupLabelId?: string;
    menus: {
        href: string;
        labelEn: string;
        labelId: string;
        icon: LucideIcon;
    }[];
}

export interface ProfileAvatarsProps {
    avatars?: string | null;
    name?: string | null;
    username?: string | null;
    className?: string;
}

export type PersonalProfile = Omit<Partial<typeof AUTHOR_PROFILE_DATA>, "title"> & {
    photo_url?: string | null;
    display_name?: string;
    username?: string;
    portfolio_url?: string | null;
    title?: string[] | string | null;
};

export interface NavigationMenuProps {
    pathname: string;
    profile?: PersonalProfile | null;
}