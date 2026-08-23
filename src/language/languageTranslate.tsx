"use client";

import { BlurFadeText } from "@/components";
import { useLanguage } from "./languageProvider";

interface LanguageTextProps {
    enText: React.ReactNode;
    idText: React.ReactNode;
}

interface LanguageBlurFadeTextProps extends Omit<React.ComponentProps<typeof BlurFadeText>, "text"> {
    enText: string;
    idText: string;
}

export function LanguageText({ enText, idText }: LanguageTextProps) {
    const { lang } = useLanguage();
    return <>{lang === "en" ? enText : idText}</>;
}

export function LanguageBlurFadeText({ enText, idText, ...props }: LanguageBlurFadeTextProps) {
    const { lang } = useLanguage();
    return <BlurFadeText text={lang === "en" ? enText : idText} {...props} />;
}