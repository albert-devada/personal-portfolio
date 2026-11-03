import { SiYoutube } from "react-icons/si";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";

export function getLinkIcon(title: string) {
    if (!title) return GlobeIcon;
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("github")) {
        return GitHubLogoIcon;
    }

    if (lowerTitle.includes("youtube")) {
        return SiYoutube;
    }

    return GlobeIcon;
}