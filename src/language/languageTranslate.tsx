"use client";

import { useLanguage } from "./languageProvider";
import BlurFadeText from "@/components/blurFadeText";

interface LanguageTextProps {
    enText: React.ReactNode;
    idText: React.ReactNode;
}

export function LanguageText({ enText, idText }: LanguageTextProps) {
    const { lang } = useLanguage();
    return <>{lang === "en" ? enText : idText}</>;
}

interface LanguageBlurFadeTextProps extends Omit<React.ComponentProps<typeof BlurFadeText>, "text"> {
    enText: string;
    idText: string;
}

export function LanguageBlurFadeText({ enText, idText, ...props }: LanguageBlurFadeTextProps) {
    const { lang } = useLanguage();
    return <BlurFadeText text={lang === "en" ? enText : idText} {...props} />;
}