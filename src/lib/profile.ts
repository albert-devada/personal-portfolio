import { authors } from "@/common/constants";
import {
    GitHubLogoIcon,
    LinkedInLogoIcon,
    InstagramLogoIcon,
} from "@radix-ui/react-icons";
import { SiHackerone } from "react-icons/si";
const mainAuthor = authors.mainAuthor;

export const ProfileData = {
    full_name: mainAuthor.name,
    display_name: mainAuthor.displayName,
    username: mainAuthor.username,
    title: mainAuthor.titles,
    description_en: mainAuthor.description.en,
    description_id: mainAuthor.description.id,
    location: mainAuthor.location,
    activity: mainAuthor.activity,
    status_work: mainAuthor.status_work,
};

export const MediaSocials = [
    {
        title: "Instagram",
        href: mainAuthor.instagram,
        icon: InstagramLogoIcon,
    },
    {
        title: "LinkedIn",
        href: mainAuthor.linkedin,
        icon: LinkedInLogoIcon,
    },
    {
        title: "GitHub",
        href: mainAuthor.github,
        icon: GitHubLogoIcon,
    },
    {
        title: "HackerOne",
        href: mainAuthor.hackerone,
        icon: SiHackerone,
    },
];