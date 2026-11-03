import type { Author } from "@/common/types";

export const AuthorData: Author = {
    version: "1.2.0",
    name: "Naufal Burhanuddin Yusuf",
    displayName: "Naufal Burhan",
    username: "@albert_devada",
    nickname: "Albert Devada",
    jobTitle: "Security Researcher & Software Engineer",
    titles: ["Security Researcher", "Software Engineer"],
    description: {
        en: "I am a technology enthusiast with a strong curiosity about the digital world. I enjoy learning and experimenting to understand how technology works as a whole. For me, every mistake is an important part of the learning process.",
        id: "Saya adalah seorang penggemar teknologi dengan rasa ingin tahu yang tinggi terhadap dunia digital. Saya senang mempelajari dan bereksperimen untuk memahami cara kerja teknologi secara menyeluruh. Bagi saya, setiap kesalahan merupakan bagian penting dari proses pembelajaran.",
    },
    location: "Bekasi, Indonesia",
    activity: "Independent Developer & Bug Bounty Hunter",
    status_work: false,
    url: process.env.NEXT_PUBLIC_WEB_URL || "https://albertdevada.me",
    instagram: "https://instagram.com/albert_devada",
    linkedin: "https://www.linkedin.com/in/albertdevada",
    github: "https://github.com/albert-devada",
    hackerone: "https://hackerone.com/albertdevada",
};

export const API_CONFIG = {
    version: AuthorData.version,
    author: {
        name: AuthorData.nickname,
        github: AuthorData.github,
        instagram: AuthorData.instagram,
        linkedin: AuthorData.linkedin,
        hackerone: AuthorData.hackerone,
    },
};
