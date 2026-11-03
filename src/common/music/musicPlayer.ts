"use client";

import { useSyncExternalStore } from "react";
import { PLAYLIST } from "./musicPlaylist";

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

export function getAudioInstance() {
    if (typeof window === "undefined") return null;

    if (!sharedAudio) {
        sharedAudio = new Audio();
        sharedAudio.volume = 1.0;

        if (PLAYLIST.length > 0 && PLAYLIST[sharedIndex]) {
            sharedAudio.src = PLAYLIST[sharedIndex].file;
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

export function playTrackAtIndex(index: number) {
    const audio = getAudioInstance();
    if (!audio || PLAYLIST.length === 0) return;
    sharedIndex = index;
    const track = PLAYLIST[index];
    audio.src = track.file;
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

    if (!audio.src || audio.src === "" || !audio.src.endsWith(PLAYLIST[sharedIndex].file)) {
        audio.src = PLAYLIST[sharedIndex].file;
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

export function toggleGlobalPlay() {
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

export function playNextTrack() {
    if (PLAYLIST.length === 0) return;
    const nextIndex = (sharedIndex + 1) % PLAYLIST.length;
    playTrackAtIndex(nextIndex);
}

export function playPrevTrack() {
    if (PLAYLIST.length === 0) return;
    const prevIndex = (sharedIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playTrackAtIndex(prevIndex);
}

export function useMusicPlayer() {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const currentTrack = PLAYLIST[state.currentIndex] || null;

    return {
        ...state,
        currentTrack,
        toggleGlobalPlay,
        playNextTrack,
        playPrevTrack,
        playTrackAtIndex,
        startGlobalPlay,
    };
}
