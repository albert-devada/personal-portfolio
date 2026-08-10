export interface Track {
    id: number;
    title: string;
    artist: string;
    files: string;
    cover?: string;
}

export const PLAYLIST: Track[] = [
    {
        id: 1,
        title: "In the Stars (Slowed + Reverb)",
        artist: "Benson Boone",
        files: "/playlist/in-the-stars-slowed-reverb.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000aa54bb7e572c37d8b2aa7e18b9bc",
    },
    {
        id: 2,
        title: "Set Fire To The Rain x Another Love",
        artist: "Adele, Tom Odell",
        files: "/playlist/set-fire-to-the-rain-x-another-love.mp3",
        cover: "https://raw.githubusercontent.com/albert-devada/albert-devada/refs/heads/main/img/Anime-Sad-Boy-Manga-Series-HD-Background-Wallpaper-106481.jpg",
    },
    {
        id: 3,
        title: "Lonely (Slowed + Reverb)",
        artist: "Akon",
        files: "/playlist/lonely-slowed-reverb.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000aa5475efdb59b1ab02452a7d59e0",
    },
    {
        id: 4,
        title: "Ojitos Lindos (Slowed + Reverb)",
        artist: "Bad Bunny, Bomba Estéreo",
        files: "/playlist/ojitos-lindos-slowed-reverb.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000aa5449d694203245f241a1bcaa72",
    },
    {
        id: 5,
        title: "Bebe (Slowed + Reverb)",
        artist: "Anuel AA, Ozuna",
        files: "/playlist/bebe-slowed-reverb.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000aa54b0a875d7f1bfe4ec4aaffa48",
    },
    {
        id: 6,
        title: "Blue (Slowed + Reverb)",
        artist: "Yung Kai",
        files: "/playlist/blue.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000aa54def6ffd0e4b80cb0d2a0d00f",
    },
];

