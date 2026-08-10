"use client";

import { useState, useRef } from "react";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";
import { appToast } from "@/components/sonnerProvider";
import { BlurFade } from "@/components/blurFade";
import { Card, CardContent } from "@/components/containerCard";
import {
    Check,
    Copy,
    Trash2,
    Code2,
    Minimize2,
    Sparkles,
    AlertCircle,
} from "lucide-react";

type FormatMode = "prettify" | "minify";
const BLUR_FADE_DELAY = 0.1;

export default function TabJsonFormatter() {
    const { lang } = useLanguage();
    const [inputJson, setInputJson] = useState<string>("");
    const [formattedJson, setFormattedJson] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [formatMode, setFormatMode] = useState<FormatMode>("prettify");
    const isErrorLocked = useRef<boolean>(false);

    const handleFormat = (mode: FormatMode, text: string = inputJson) => {
        setFormatMode(mode);
        if (!text.trim()) {
            setFormattedJson("");
            setErrorMsg(null);
            isErrorLocked.current = false;
            return;
        }

        if (isErrorLocked.current) {
            setFormattedJson("");
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const indent = mode === "prettify" ? 2 : 0;
            const formatted = JSON.stringify(parsed, null, indent);
            setFormattedJson(formatted);
            setErrorMsg(null);
        } catch (err: unknown) {
            const detail = err instanceof Error ? err.message : "Syntax Error";
            setErrorMsg(detail);
            setFormattedJson("");
            isErrorLocked.current = true;

            const toastMsg =
                lang === "en"
                    ? "Invalid JSON format."
                    : "Format JSON tidak valid.";
            appToast.error(toastMsg);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInputJson(val);
        if (!val.trim()) {
            setFormattedJson("");
            setErrorMsg(null);
            isErrorLocked.current = false;
        } else {
            handleFormat(formatMode, val);
        }
    };

    const handleCopy = () => {
        if (!formattedJson || errorMsg) return;
        navigator.clipboard.writeText(formattedJson);
        setCopied(true);
        const copyMsg = lang === "en" ? "JSON copied to clipboard!" : "JSON berhasil disalin!";
        appToast.success(copyMsg);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputJson("");
        setFormattedJson("");
        setErrorMsg(null);
        isErrorLocked.current = false;
    };

    return (
        <div className="space-y-4">
            <BlurFade delay={BLUR_FADE_DELAY} inView>
                <Card>
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-2 text-primary">
                                <Code2 className="h-5 w-5" />
                                <LanguageBlurFadeText delay={BLUR_FADE_DELAY + 0.1}
                                    enText="JSON Formatter & Validator"
                                    idText="Format & Validasi JSON"
                                    className="font-semibold text-base sm:text-lg text-foreground"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex rounded-lg border border-black/10 dark:border-white/10 bg-background/50 p-1 gap-1">
                                    <button
                                        onClick={() => {
                                            isErrorLocked.current = false;
                                            setErrorMsg(null);
                                            handleFormat("prettify");
                                        }}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 flex items-center gap-1.5 ${
                                            formatMode === "prettify"
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                                        }`}>
                                        <Sparkles className="h-4 w-4" />
                                        <LanguageText enText="Prettify (2 Spaces)" idText="Format Rapi"/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            isErrorLocked.current = false;
                                            setErrorMsg(null);
                                            handleFormat("minify");
                                        }}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 flex items-center gap-1.5 ${
                                            formatMode === "minify"
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                                        }`}>
                                        <Minimize2 className="h-4 w-4" />
                                        <LanguageText enText="Minify" idText="Minifikasi" />
                                    </button>
                                </div>
                                <button onClick={handleClear}
                                    title="Clear"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-destructive/15 px-3 py-1.5 text-xs sm:text-sm font-semibold text-destructive hover:bg-destructive hover:text-white shadow-sm active:scale-95 transition-all duration-200">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        <LanguageText enText="Clear" idText="Bersihkan" />
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-5">
                            <BlurFade delay={BLUR_FADE_DELAY + 0.15} inView>
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center justify-between">
                                        <LanguageBlurFadeText delay={BLUR_FADE_DELAY + 0.2}
                                            enText="Raw JSON Input:"
                                            idText="Input JSON Mentah:"
                                            className="text-xs sm:text-sm font-semibold text-foreground/90"
                                        />
                                        <span className="text-primary font-mono text-xs">
                                            ({formatMode.toUpperCase()})
                                        </span>
                                    </label>
                                    <textarea
                                        value={inputJson}
                                        onChange={handleInputChange}
                                        placeholder='{"name": "Antigravity", "role": "Developer"}'
                                        rows={10}
                                        className="w-full min-h-55 sm:min-h-65 rounded-lg border border-black/10 dark:border-white/10 bg-background/50 p-3.5 sm:p-4 font-mono text-xs sm:text-sm placeholder:text-muted-foreground/70 leading-relaxed focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary text-foreground transition-all duration-200"
                                    />
                                </div>
                            </BlurFade>
                            <BlurFade delay={BLUR_FADE_DELAY + 0.2} inView>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-2">
                                            <LanguageBlurFadeText delay={BLUR_FADE_DELAY + 0.25}
                                                enText="Formatted Output:"
                                                idText="Hasil Format:"
                                                className="text-xs sm:text-sm font-semibold text-foreground/90"
                                            />
                                            {errorMsg && (
                                                <span className="text-xs text-destructive font-mono font-medium flex items-center gap-1">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    <LanguageText enText="Invalid JSON" idText="JSON Tidak Valid" />
                                                </span>
                                            )}
                                        </label>
                                        {formattedJson && !errorMsg && (
                                            <button onClick={handleCopy}
                                                className="inline-flex cursor-pointer items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline hover:opacity-80 active:scale-95 transition-all duration-200">
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        <LanguageText
                                                            enText="Copied!"
                                                            idText="Tersalin!"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        <LanguageText
                                                            enText="Copy Result"
                                                            idText="Salin Hasil"
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            readOnly
                                            disabled={!!errorMsg}
                                            value={
                                                errorMsg
                                                    ? `${
                                                            lang === "en"
                                                                ? "Syntax Error: "
                                                                : "Kesalahan Sintaks: "
                                                        }${errorMsg}`
                                                    : formattedJson
                                            }
                                            placeholder={
                                                lang === "en"
                                                    ? "Output will appear here..."
                                                    : "Hasil akan muncul di sini..."
                                            }
                                            rows={10}
                                            className={`w-full min-h-55 sm:min-h-65 rounded-lg border p-3.5 sm:p-4 font-mono text-xs sm:text-sm placeholder:text-muted-foreground/70 leading-relaxed focus-visible:outline-hidden focus-visible:ring-1 transition-all duration-200
                                            ${
                                                errorMsg ? "border-destructive/50 bg-destructive/5 text-destructive dark:bg-destructive/10 font-normal cursor-not-allowed" : "border-black/10 dark:border-white/10 bg-background/50 text-foreground focus-visible:ring-primary"
                                            }`}
                                        />
                                    </div>
                                </div>
                            </BlurFade>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
