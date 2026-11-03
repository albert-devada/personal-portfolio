import { AuthorData } from "@/common/config/author";
import { GitHubLogoIcon, LinkedInLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { SiHackerone } from "react-icons/si";

export const AUTHOR_PROFILE_DATA = {
    full_name: AuthorData.name,
    display_name: AuthorData.displayName,
    username: AuthorData.username,
    title: AuthorData.titles,
    description_en: AuthorData.description.en,
    description_id: AuthorData.description.id,
    location: AuthorData.location,
    activity: AuthorData.activity,
    status_work: AuthorData.status_work,
    photo_url: "/assets/avatar.jpeg",
};

export const MEDIA_SOCIALS_PROFILE  = [
    {
        title: "Instagram",
        href: AuthorData.instagram,
        icon: InstagramLogoIcon,
    },
    {
        title: "LinkedIn",
        href: AuthorData.linkedin,
        icon: LinkedInLogoIcon,
    },
    {
        title: "GitHub",
        href: AuthorData.github,
        icon: GitHubLogoIcon,
    },
    {
        title: "HackerOne",
        href: AuthorData.hackerone,
        icon: SiHackerone,
    },
];