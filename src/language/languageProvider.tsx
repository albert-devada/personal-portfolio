"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/utils";

type Language = "en" | "id";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("lang") as Language;
        if (savedLang === "en" || savedLang === "id") {
            const timer = setTimeout(() => {
                setLangState(savedLang);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export interface LanguageToggleSwitchProps {
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    trigger?: boolean;
}

export const LanguageToggleSwitch = React.memo(function LanguageToggleSwitch({delay = 1.5, direction = "up", className = "", trigger }: LanguageToggleSwitchProps) {
    const { lang, setLang } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frameId);
    }, []);

    const isID = lang === "id";

    const toggleLanguage = useCallback(() => {
        setLang(isID ? "en" : "id");
    }, [isID, setLang]);

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
            className={cn("z-50", className)}>
            <button
                ref={buttonRef}
                onClick={toggleLanguage}
                className="relative flex items-center w-28 h-10 rounded-full p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none"
                aria-label="Toggle Language">
                <div className="absolute inset-0 flex justify-between items-center px-3.5 pointer-events-none text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <Image
                            src="https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/gb.svg"
                            alt="EN"
                            aria-hidden="true"
                            width={14}
                            height={10}
                            unoptimized
                            className="w-3.5 h-2.5 object-cover rounded-xs"
                        />
                        <span>EN</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Image
                            src="https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/id.svg"
                            alt="ID"
                            aria-hidden="true"
                            width={14}
                            height={10}
                            unoptimized
                            className="w-3.5 h-2.5 object-cover rounded-xs"
                        />
                        <span>ID</span>
                    </span>
                </div>
                <motion.div
                    initial={false}
                    animate={{
                        x: isID ? 56 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="z-10 flex items-center justify-center w-12 h-8 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-800 dark:text-slate-100 gap-1.5">
                    {isID ? (
                        <>
                            <Image
                                src="https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/id.svg"
                                alt="ID"
                                aria-hidden="true"
                                width={14}
                                height={10}
                                unoptimized
                                className="w-3.5 h-2.5 object-cover rounded-xs"
                            />
                            <span>ID</span>
                        </>
                    ) : (
                        <>
                            <Image
                                src="https://raw.githubusercontent.com/b4codeid/flagiconsmain/main/gb.svg"
                                alt="EN"
                                aria-hidden="true"
                                width={14}
                                height={10}
                                unoptimized
                                className="w-3.5 h-2.5 object-cover rounded-xs"
                            />
                            <span>EN</span>
                        </>
                    )}
                </motion.div>
            </button>
        </motion.div>
    );
});