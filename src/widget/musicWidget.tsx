"use client";

import Image from "next/image";
import { PLAYLIST } from "@/lib";
import { Typography } from "@/theme";
import { useSyncExternalStore } from "react";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

interface MusicWidgetProps {
    className?: string;
}

let sharedAudio: HTMLAudioElement | null = null;
let sharedIndex: number = PLAYLIST.length > 0 ? Math.floor(Math.random() * PLAYLIST.length) : 0;
let sharedIsPlaying: boolean = false;
let sharedCurrentTime: number = 0;
let sharedDuration: number = 0;

const listeners = new Set<() => void>();

function emitChange() {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

const SERVER_SNAPSHOT = {
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
};

let cachedSnapshot = {
    currentIndex: sharedIndex,
    isPlaying: sharedIsPlaying,
    currentTime: sharedCurrentTime,
    duration: sharedDuration,
};

function getSnapshot() {
    if (cachedSnapshot.currentIndex !== sharedIndex || cachedSnapshot.isPlaying !== sharedIsPlaying || cachedSnapshot.currentTime !== sharedCurrentTime || cachedSnapshot.duration !== sharedDuration) {
        cachedSnapshot = {
            currentIndex: sharedIndex,
            isPlaying: sharedIsPlaying,
            currentTime: sharedCurrentTime,
            duration: sharedDuration,
        };
    }
    return cachedSnapshot;
}

function getServerSnapshot() {
    return SERVER_SNAPSHOT;
}

function getAudioInstance() {
    if (typeof window === "undefined") return null;

    if (!sharedAudio) {
        sharedAudio = new Audio();
        sharedAudio.volume = 1.0;

        if (PLAYLIST.length > 0 && PLAYLIST[sharedIndex]) {
            sharedAudio.src = PLAYLIST[sharedIndex].files;
        }

        sharedAudio.addEventListener("timeupdate", () => {
            if (sharedAudio) {
                sharedCurrentTime = sharedAudio.currentTime;
                emitChange();
            }
        });

        sharedAudio.addEventListener("loadedmetadata", () => {
            if (sharedAudio) {
                sharedDuration = sharedAudio.duration || 0;
                emitChange();
            }
        });

        sharedAudio.addEventListener("ended", () => {
            playNextTrack();
        });
    }
    return sharedAudio;
}

function playTrackAtIndex(index: number) {
    const audio = getAudioInstance();
    if (!audio || PLAYLIST.length === 0) return;
    sharedIndex = index;
    const track = PLAYLIST[index];
    audio.src = track.files;
    audio.load();
    sharedCurrentTime = 0;

    if (sharedIsPlaying) {
        audio.play().then(() => {
            sharedIsPlaying = true;
            emitChange();
        }).catch((err) => {
            console.log("Autoplay blocked or failed:", err);
            sharedIsPlaying = false;
            emitChange();
        });
    } else {
        emitChange();
    }
}

export function startGlobalPlay() {
    const audio = getAudioInstance();
    if (!audio || PLAYLIST.length === 0) return;

    if (!audio.src || audio.src === "" || !audio.src.endsWith(PLAYLIST[sharedIndex].files)) {
        audio.src = PLAYLIST[sharedIndex].files;
    }

    audio.play().then(() => {
        sharedIsPlaying = true;
        emitChange();
    }).catch((err) => {
        console.log("Gagal memutar audio:", err);
        sharedIsPlaying = false;
        emitChange();
    });
}

function toggleGlobalPlay() {
    const audio = getAudioInstance();
    if (!audio || PLAYLIST.length === 0) return;

    if (sharedIsPlaying) {
        audio.pause();
        sharedIsPlaying = false;
        emitChange();
    } else {
        startGlobalPlay();
    }
}

function playNextTrack() {
    if (PLAYLIST.length === 0) return;
    const nextIndex = (sharedIndex + 1) % PLAYLIST.length;
    playTrackAtIndex(nextIndex);
}

function playPrevTrack() {
    if (PLAYLIST.length === 0) return;
    const prevIndex = (sharedIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrackAtIndex(prevIndex);
}

export const MusicWidget = ({ className }: MusicWidgetProps) => {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const { currentIndex, isPlaying, currentTime, duration } = state;
    const currentTrack = PLAYLIST[currentIndex] || null;
    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);  
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div
            className={`
                flex items-center p-2.5 rounded-2xl backdrop-blur-xl
                border border-black/5 dark:border-white/10
                shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                transition-all duration-300 overflow-hidden shrink-0 ${className}`
            }>
            <div className="w-11 h-11 rounded-[10px] bg-linear-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                {currentTrack?.cover ? (
                    <Image
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                        unoptimized
                    />
                ) : (
                    <Music size={20} className="text-zinc-400 dark:text-zinc-500" />
                )}
            </div>
            <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
                <div className="w-full overflow-hidden relative">
                    <Typography.P className="animate-marquee text-[14px] font-bold text-black dark:text-white leading-tight font-sans whitespace-nowrap">
                        {currentTrack ? (
                            <>
                                {currentTrack.artist.toLowerCase()} - {currentTrack.title.toLowerCase()}
                                <span className="mx-3 opacity-60">•</span>
                                {currentTrack.artist.toLowerCase()} - {currentTrack.title.toLowerCase()}
                                <span className="mx-3 opacity-60">•</span>
                            </>
                        ) : (
                            "not playing - select a track"
                        )}
                    </Typography.P>
                </div>
                <Typography.P className="text-[12px] font-medium text-zinc-800 dark:text-zinc-400 truncate leading-tight font-sans mt-0.5">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography.P>
            </div>
            <div className="flex items-center space-x-8 md:space-x-3 mr-2 ml-3 shrink-0 text-black dark:text-white">
                <button onClick={playPrevTrack}
                    title="Previous"
                    className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <SkipBack size={20} className="fill-current" />
                </button>
                <button onClick={toggleGlobalPlay}
                    title={isPlaying ? "Pause" : "Play"}
                    className="opacity-90 hover:opacity-100 transition-opacity transform active:scale-95 cursor-pointer">
                    {isPlaying ? (
                        <Pause size={20} className="fill-current" />
                    ) : (
                        <Play size={20} className="fill-current" />
                    )}
                </button>
                <button onClick={playNextTrack}
                    title="Next"
                    className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <SkipForward size={20} className="fill-current" />
                </button>
            </div>
        </div>
    );
};


