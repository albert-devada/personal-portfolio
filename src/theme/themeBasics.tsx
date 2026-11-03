"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef, useCallback, PropsWithChildren } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { cn } from "@/utils";

function getThemeTransitionClipPaths(cx: number, cy: number, maxRadius: number): [string, string] {
    return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
    ];
}

export interface ThemeToggleButtonProps {
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    trigger?: boolean;
}

export const ThemeToggleSwitch = React.memo(function ThemeToggleButton({delay = 1.3, direction = "up", className = "", trigger}: ThemeToggleButtonProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => { setMounted(true); });
        return () => cancelAnimationFrame(frameId);
    }, []);

    const isDark = resolvedTheme === "dark";

    const toggleTheme = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        const newTheme = isDark ? "light" : "dark";
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const { top, left, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;

        const maxRadius = Math.hypot(
            Math.max(x, viewportWidth - x),
            Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
            document.documentElement.classList.toggle("dark");
            setTheme(newTheme);
        };

        if (typeof document.startViewTransition !== "function") {
            applyTheme();
            return;
        }

        const clipPath = getThemeTransitionClipPaths(x, y, maxRadius);
        const root = document.documentElement;
        root.dataset.magicuiThemeVt = "active";
        root.style.setProperty("--magicui-theme-toggle-vt-duration", `500ms`);
        root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

        const cleanup = () => {
            delete root.dataset.magicuiThemeVt;
            root.style.removeProperty("--magicui-theme-toggle-vt-duration");
            root.style.removeProperty("--magicui-theme-vt-clip-from");
        };

        const transition = document.startViewTransition(() => {
            flushSync(applyTheme);
        });

        if (typeof transition?.finished?.finally === "function") {
            transition.finished.finally(cleanup);
        } else {
            cleanup();
        }

        const ready = transition?.ready;
        if (ready && typeof ready.then === "function") {
            ready.then(() => {
                document.documentElement.animate(
                    { clipPath },
                    {
                        duration: 500,
                        easing: "ease-in-out",
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });
        }
    }, [isDark, setTheme]);

    if (!mounted) {
        return null;
    }

    const isVisible = trigger !== undefined ? trigger : true;
    const yOffset = direction === "up" ? 24 : direction === "down" ? -24 : 0;
    const xOffset = direction === "right" ? -24 : direction === "left" ? 24 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset, x: xOffset, filter: "blur(8px)", pointerEvents: "none" }}
            animate={isVisible ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)", pointerEvents: "auto" } : { opacity: 0, y: yOffset, x: xOffset, filter: "blur(8px)", pointerEvents: "none" }}
            transition={{ delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className={cn("z-50", className || "fixed bottom-9 right-9")}>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                type="button"
                className={`relative flex items-center w-20 h-10 rounded-full p-1 transition-colors duration-500 cursor-pointer focus:outline-none ${
                    isDark ? "bg-slate-800 border border-slate-700 shadow-lg shadow-black/20" : "bg-sky-200 border border-sky-300 shadow-md"
                }`}
                aria-label="Toggle Theme"
                title="Toggle Theme">
                <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none text-slate-400 dark:text-slate-500">
                    <Sun size={18} strokeWidth={2.5} />
                    <Moon size={18} strokeWidth={2.5} />
                </div>
                <motion.div
                    layout
                    initial={false}
                    animate={{
                        x: isDark ? 40 : 0,
                        rotate: isDark ? 360 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md">
                    {isDark ? (
                        <Moon size={16} strokeWidth={2.5} className="text-slate-800" />
                    ) : (
                        <Sun size={16} strokeWidth={2.5} className="text-amber-500" />
                    )}
                </motion.div>
            </button>
        </motion.div>
    );
});

export const lenisDefaultOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical" as const,
    gestureOrientation: "vertical" as const,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    prevent: (node: HTMLElement) => node.hasAttribute("data-lenis-prevent") || Boolean(node.closest?.("[data-lenis-prevent]")),
};

export function ThemeBasics({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <ReactLenis root options={lenisDefaultOptions}>
            <div className={cn("min-h-screen bg-transparent text-foreground flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white", className)}>
                {children}
            </div>
        </ReactLenis>
    );
}

