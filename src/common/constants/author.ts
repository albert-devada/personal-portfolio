export interface Author {
    version: string;
    name: string;
    displayName: string;
    username: string;
    nickname: string;
    jobTitle: string;
    titles: string[];
    description: {
        en: string;
        id: string;
    };
    location: string;
    activity: string;
    status_work: boolean;
    url: string;
    instagram: string;
    github: string;
    linkedin: string;
    hackerone?: string;
}

export const authors = {
    mainAuthor: {
        version: "1.0.0",
        name: "Naufal Burhanuddin Yusuf",
        displayName: "Naufal Burhan",
        username: "@albert_devada",
        nickname: "Albert Devada",
        jobTitle: "Cybersecurity & Backend Enthusiast",
        titles: ["Cybersecurity Enthusiast", "Backend Enthusiast"],
        description: {
            en: "I am a technology enthusiast with a strong curiosity about the digital world. I enjoy learning and experimenting to understand how technology works as a whole. For me, every mistake is an important part of the learning process.",
            id: "Saya adalah seorang penggemar teknologi dengan rasa ingin tahu yang tinggi terhadap dunia digital. Saya senang mempelajari dan bereksperimen untuk memahami cara kerja teknologi secara menyeluruh. Bagi saya, setiap kesalahan merupakan bagian penting dari proses pembelajaran.",
        },
        location: "Bekasi, Indonesia",
        activity: "Freelancer & Active Bug Hunter",
        status_work: false,
        url: process.env.APP_DOMAIN || "",
        instagram: "https://instagram.com/albert_devada",
        linkedin: "https://www.linkedin.com/in/albertdevada",
        github: "https://github.com/albert-devada",
        hackerone: "https://hackerone.com/albertdevada",
    },
} as const satisfies Record<string, Author>;

export type AuthorKey = keyof typeof authors;

export function getAuthor(key: AuthorKey): Author {
    return authors[key];
}

export function isValidAuthor(key: string): key is AuthorKey {
    return key in authors;
}