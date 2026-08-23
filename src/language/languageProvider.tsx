"use client";

import { motion } from "framer-motion";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

type Language = "en" | "id";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

export function LanguageToggle() {
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
        return (
            <div className="w-24 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={toggleLanguage}
            className="relative flex items-center w-24 h-10 rounded-full p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none"
            aria-label="Toggle Language"
            title="Toggle Language">
            <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none text-[10px] font-bold text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                    <span className="text-xs">🇬🇧</span>
                    <span>EN</span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="text-xs">🇮🇩</span>
                    <span>ID</span>
                </span>
            </div>
            <motion.div
                layout
                initial={false}
                animate={{
                    x: isID ? 44 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className="z-10 flex items-center justify-center w-11 h-8 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-800 dark:text-slate-100 gap-1">
                {isID ? (
                    <>
                        <span className="text-xs leading-none">🇮🇩</span>
                        <span>ID</span>
                    </>
                ) : (
                    <>
                        <span className="text-xs leading-none">🇬🇧</span>
                        <span>EN</span>
                    </>
                )}
            </motion.div>
        </button>
    );
}