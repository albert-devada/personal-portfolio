"use client";

import Image from "next/image";
import { useMusicPlayer } from "@/common/music";
import { Typography } from "@/theme";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

export interface MusicPlayerProps {
    className?: string;
}

export const MusicPlayer = ({ className }: MusicPlayerProps) => {
    const { currentTrack, isPlaying, currentTime, duration, toggleGlobalPlay, playNextTrack, playPrevTrack } = useMusicPlayer();

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
                border border-black/10 dark:border-white/15
                shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
                transition-all duration-300 overflow-hidden shrink-0 ${className || ""}`
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
                    <Typography.P className="animate-marquee text-[14px] font-bold text-zinc-900 dark:text-white leading-tight font-sans whitespace-nowrap">
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
                <Typography.P className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300 truncate leading-tight font-sans mt-0.5">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography.P>
            </div>
            <div className="flex items-center space-x-8 md:space-x-3 mr-2 ml-3 shrink-0 text-zinc-900 dark:text-white">
                <button
                    onClick={playPrevTrack}
                    title="Previous"
                    className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <SkipBack size={20} className="fill-current" />
                </button>
                <button
                    onClick={toggleGlobalPlay}
                    title={isPlaying ? "Pause" : "Play"}
                    className="opacity-100 hover:opacity-90 transition-opacity transform active:scale-95 cursor-pointer">
                    {isPlaying ? (
                        <Pause size={20} className="fill-current" />
                    ) : (
                        <Play size={20} className="fill-current" />
                    )}
                </button>
                <button
                    onClick={playNextTrack}
                    title="Next"
                    className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <SkipForward size={20} className="fill-current" />
                </button>
            </div>
        </div>
    );
};