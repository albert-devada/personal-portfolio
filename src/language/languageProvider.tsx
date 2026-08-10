"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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