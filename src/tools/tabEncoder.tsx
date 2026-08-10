"use client";

import { useState, useRef } from "react";
import { LanguageText, LanguageBlurFadeText } from "@/language/languageTranslate";
import { useLanguage } from "@/language/languageProvider";
import { appToast } from "@/components/sonnerProvider";
import { BlurFade } from "@/components/blurFade";
import { Card, CardContent } from "@/components/containerCard";
import { Binary, Check, Copy, Trash2, AlertCircle } from "lucide-react";

type EncodingMode = "base64" | "url";
type ActionType = "encode" | "decode";
const BLUR_FADE_DELAY = 0.1;

export default function TabEncoder() {
    const { lang } = useLanguage();
    const [mode, setMode] = useState<EncodingMode>("base64");
    const [action, setAction] = useState<ActionType>("encode");
    const [inputText, setInputText] = useState<string>("");
    const [outputText, setOutputText] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const isErrorLocked = useRef<boolean>(false);

    const processText = ( text: string, currentMode: EncodingMode, currentAction: ActionType ) => {
        
        if (!text.trim()) {
            setOutputText("");
            setErrorMsg(null);
            isErrorLocked.current = false;
            return;
        }

        if (isErrorLocked.current) {
            setOutputText("");
            return;
        }

        try {
            let result = "";

            if (currentMode === "base64") {
                if (currentAction === "encode") {
                    result = btoa(text);
                } else {
                    result = atob(text);
                }
            } else if (currentMode === "url") {
                if (currentAction === "encode") {
                    result = encodeURIComponent(text);
                } else {
                    result = decodeURIComponent(text);
                }
            }

            setOutputText(result);
            setErrorMsg(null);

        } catch (err: unknown) {
            const detail = err instanceof Error ? err.message : "Decode Error";
            setErrorMsg(detail);
            setOutputText("");
            isErrorLocked.current = true;
            const toastMsg = lang === "en" ? "Failed to decode input string." : "Gagal mendekode teks input.";
            appToast.error(toastMsg);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInputText(val);
        if (!val.trim()) {
            setOutputText("");
            setErrorMsg(null);
            isErrorLocked.current = false;
        } else {
            processText(val, mode, action);
        }
    };

    const handleModeChange = (newMode: EncodingMode) => {
        setMode(newMode);
        isErrorLocked.current = false;
        setErrorMsg(null);
        processText(inputText, newMode, action);
    };

    const handleActionChange = (newAction: ActionType) => {
        setAction(newAction);
        isErrorLocked.current = false;
        setErrorMsg(null);
        processText(inputText, mode, newAction);
    };

    const handleCopy = () => {
        if (!outputText || errorMsg) return;
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        const copyMsg = lang === "en" ? "Text copied to clipboard!" : "Teks berhasil disalin!";
        appToast.success(copyMsg);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setOutputText("");
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
                                <Binary className="h-5 w-5" />
                                <LanguageBlurFadeText  delay={BLUR_FADE_DELAY + 0.1}
                                    enText="Text Encoder / Decoder"
                                    idText="Enkoder / Dekoder Teks"
                                    className="font-semibold text-base sm:text-lg text-foreground"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex rounded-lg border border-black/10 dark:border-white/10 bg-background/50 p-1 gap-1">
                                    <button
                                        onClick={() => handleModeChange("base64")}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 
                                        ${ mode === "base64" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"}`}>
                                        Base64
                                    </button>
                                    <button
                                        onClick={() => handleModeChange("url")}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 
                                        ${mode === "url" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"}`}>
                                        URL Component
                                    </button>
                                </div>
                                <div className="flex rounded-lg border border-black/10 dark:border-white/10 bg-background/50 p-1 gap-1">
                                    <button
                                        onClick={() => handleActionChange("encode")}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 
                                        ${ action === "encode" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"}`}>
                                        Encode
                                    </button>
                                    <button
                                        onClick={() => handleActionChange("decode")}
                                        className={`cursor-pointer px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md active:scale-95 transition-all duration-200 
                                        ${action === "decode" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"}`}>
                                        Decode
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
                                            enText="Input Text:"
                                            idText="Teks Input:"
                                            className="text-xs sm:text-sm font-semibold text-foreground/90"
                                        />
                                        <span className="text-primary font-mono text-xs">
                                            ({mode.toUpperCase()} - {action.toUpperCase()})
                                        </span>
                                    </label>
                                    <textarea
                                        value={inputText}
                                        onChange={handleInputChange}
                                        placeholder={
                                            lang === "en"
                                                ? action === "encode"
                                                    ? "Type or paste text to encode..."
                                                    : mode === "base64"
                                                        ? "Paste Base64 string to decode..."
                                                        : "Paste URL-encoded string to decode..."
                                                : action === "encode"
                                                    ? "Ketik atau tempel teks untuk di-encode..."
                                                    : mode === "base64"
                                                    ? "Tempel string Base64 untuk di-decode..."
                                                    : "Tempel string URL-encoded untuk di-decode..."
                                        }
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
                                                enText="Output Result:"
                                                idText="Hasil Output:"
                                                className="text-xs sm:text-sm font-semibold text-foreground/90"
                                            />
                                            {errorMsg && (
                                                <span className="text-xs text-destructive font-mono font-medium flex items-center gap-1">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    <LanguageText enText="Decode Failed" idText="Gagal Dekode" />
                                                </span>
                                            )}
                                        </label>
                                        {outputText && !errorMsg && (
                                            <button onClick={handleCopy}
                                                className="inline-flex cursor-pointer items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline hover:opacity-80 active:scale-95 transition-all duration-200">
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        <LanguageText enText="Copied!" idText="Tersalin!"  />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        <LanguageText enText="Copy Result" idText="Salin Hasil" />
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
                                                            ? "Decode Error: "
                                                            : "Kesalahan Dekode: "
                                                        }${errorMsg}`
                                                    : outputText
                                            }
                                            placeholder={
                                                lang === "en"
                                                    ? "Output will automatically appear here..."
                                                    : "Hasil akan otomatis muncul di sini..."
                                            }
                                            rows={10}
                                            className={`w-full min-h-55 sm:min-h-65 rounded-lg border p-3.5 sm:p-4 font-mono text-xs sm:text-sm placeholder:text-muted-foreground/70 leading-relaxed focus-visible:outline-hidden focus-visible:ring-1 transition-all duration-200 
                                            ${ errorMsg ? "border-destructive/50 bg-destructive/5 text-destructive dark:bg-destructive/10 font-normal cursor-not-allowed" : "border-black/10 dark:border-white/10 bg-background/50 text-foreground focus-visible:ring-primary"}`}
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
