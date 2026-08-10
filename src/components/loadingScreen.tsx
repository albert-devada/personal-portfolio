"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Music, Volume2 } from "lucide-react";
import { startGlobalPlay } from "@/widget/musicWidget";

const STATUS_STEPS = [
    "INSTALLING SYSTEM...",
    "LOADING MODULES...",
    "PREPARING PORTFOLIO...",
    "GENERATING ACCESS...",
    "SYSTEM READY."
];

interface LoadingScreenProps {
    theme?: "dark" | "light";
}

export default function LoadingScreen({ theme }: LoadingScreenProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showPermission, setShowPermission] = useState(false);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frameId);
    }, []);

    const activeTheme = mounted ? resolvedTheme || "dark" : theme || "dark";
    const isLight = activeTheme === "light";

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (document.readyState === "complete") {
            const timer = setTimeout(() => setPageLoaded(true), 0);
            return () => clearTimeout(timer);
        } else {
            const handleLoad = () => setPageLoaded(true);
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                if (prev >= 92 && !pageLoaded) {
                    return 92;
                }
                const next = prev + Math.floor(Math.random() * 2) + 1;
                return next > 100 ? 100 : next;
            });
        }, 70);

        return () => clearInterval(interval);
    }, [pageLoaded]);

    const stepIndex = progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : progress < 100 ? 3 : 4;

    useEffect(() => {
        if (progress >= 100 && pageLoaded) {
            const timer = setTimeout(() => {
                setShowPermission(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [progress, pageLoaded]);

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [visible]);

    const handleAllow = () => {
        startGlobalPlay();
        setVisible(false);
    };

    const handleDeny = () => {
        setVisible(false);
    };

    const formattedProgress = progress < 10 ? `0${progress}` : `${progress}`;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
                        isLight
                        ? "bg-sky-100/75 text-slate-900 backdrop-blur-md"
                        : "bg-[#0f172a]/75 text-slate-50 backdrop-blur-md"
                    }`}>
                    {isLight ? (
                        <>
                            <div className="absolute w-112.5 h-112.5 rounded-full bg-amber-300/25 blur-3xl pointer-events-none animate-pulse" />
                            <div className="absolute w-150 h-150 rounded-full bg-sky-200/40 blur-3xl pointer-events-none -bottom-20 -left-20" />
                        </>
                    ) : (
                        <>
                            <div className="absolute w-112.5 h-112.5 rounded-full bg-sky-500/10 blur-3xl pointer-events-none animate-pulse" />
                            <div className="absolute w-150 h-150 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none -bottom-20 -left-20" />
                        </>
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="font-mono font-bold text-3xl sm:text-4xl tracking-tight mb-2">
                            <span className={isLight ? "text-slate-950" : "text-white"}>{formattedProgress}</span>
                            <span className="text-sky-500 text-2xl sm:text-3xl font-semibold ml-0.5">%</span>
                        </motion.div>
                        <div className="h-6 mb-6 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={stepIndex}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-mono text-xs sm:text-sm tracking-widest uppercase opacity-75 font-semibold">
                                    {STATUS_STEPS[stepIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <div className={`w-64 sm:w-80 h-1 rounded-full overflow-hidden backdrop-blur-xs ${isLight ? "bg-sky-200/70" : "bg-slate-800"}`}>
                            <motion.div
                                className="h-full bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full shadow-xs"
                                style={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                        <AnimatePresence>
                            {showPermission && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={`mt-8 p-6 rounded-3xl backdrop-blur-xl border max-w-xs sm:max-w-sm w-full shadow-2xl ${
                                        isLight
                                            ? "bg-white/80 border-black/10 text-slate-900 shadow-sky-500/10"
                                            : "bg-slate-900/90 border-white/10 text-white shadow-black/50"
                                    }`}>
                                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4">
                                        <Music size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 font-sans">Play Background Music?</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-sans leading-relaxed">Enjoy background music while exploring.</p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleDeny}
                                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer ${
                                                isLight
                                                    ? "bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700"
                                                    : "bg-slate-800 hover:bg-slate-700 text-zinc-300"
                                            }`}>
                                            No, Thanks
                                        </button>
                                        <button
                                            onClick={handleAllow}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
                                            <Volume2 size={16} />
                                            Yes, Play
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}







