import { getAuthor } from "./author";
const mainAuthor = getAuthor("mainAuthor");

export const MetadataConstants = {
    creator: mainAuthor.name,
    description: mainAuthor.description.en,
    keyword: "Naufal Burhanuddin Yusuf, Naufal Burhan, Albert Devada, backend developer, cybersecurity enthusiast, ethical hacker, penetration tester, laravel developer, web security, backend engineer, indonesian cybersecurity, developer, programmer, cybersecurity",
    authors: {
        name: mainAuthor.name,
        displayName: mainAuthor.displayName,
        jobTitle: mainAuthor.jobTitle,
        url: mainAuthor.url,
        github: mainAuthor.github,
        linkedin: mainAuthor.linkedin,
        instagram: mainAuthor.instagram,
        hackerone: mainAuthor.hackerone,
    },
    openGraph: {
        url: mainAuthor.url,
        siteName: mainAuthor.name,
        locale: "en-US",
    },
    exTitle: mainAuthor.displayName,
    preview: "/preview.png",
};