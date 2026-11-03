"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageBlurFadeText, useLanguage, LanguageText } from "@/language";
import { Typography } from "@/theme";
import { BlurFade } from "@/components/transition";
import { Message, MessageContent, MessageAvatar, Bubble, BubbleContent, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/base";
import { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton } from "@/components/ui";
import { Bot, Sparkles, ArrowUp, RotateCw, Loader2 } from "lucide-react";
import { CHAT_SUGGESTION } from "@/common/constants";
import { formatCurrentTime } from "@/utils";
import { HandleChatAssistant } from "@/handlers/handleChatAssistant";
import type { ChatMessageItems } from "@/common/types";

const BLUR_FADE_DELAY = 0.03;

export function ChatAssistant() {
    const { lang } = useLanguage();
    const [messages, setMessages] = useState<ChatMessageItems[]>([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messageIdRef = useRef(0);

    const handleSend = useCallback(async (textToSend?: string) => {
        const query = (textToSend ?? input).trim();
        if (!query || isThinking) return;

        messageIdRef.current += 1;
        const userMsg: ChatMessageItems = {
            id: `user-${messageIdRef.current}`,
            role: "user",
            content: query,
            timestamp: formatCurrentTime(),
        };

        const currentHistory = [...messages, userMsg];
        setMessages(currentHistory);
        setInput("");
        setIsThinking(true);

        try {
            const historyPayload = messages.map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const replyText = await HandleChatAssistant(query, historyPayload, lang);

            messageIdRef.current += 1;
            const botMsg: ChatMessageItems = {
                id: `assistant-${messageIdRef.current}`,
                role: "assistant",
                content: replyText,
                timestamp: formatCurrentTime(),
            };

            setMessages((prev) => [...prev, botMsg]);

        } catch {
            messageIdRef.current += 1;
            const errorMsg: ChatMessageItems = {
                id: `assistant-${messageIdRef.current}`,
                role: "assistant",
                content: lang === "en" ? "Sorry, an issue occurred while reaching the AI assistant. Please try again later." : "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.",
                timestamp: formatCurrentTime(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    }, [input, isThinking, messages, lang]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleReset = useCallback(() => {
        setMessages([]);
        setInput("");
        setIsThinking(false);
    }, []);

    return (
        <TooltipProvider>
            <BlurFade delay={BLUR_FADE_DELAY * 4} className="flex flex-col gap-y-6 mt-8">
                <div className="flex flex-col gap-y-1">
                    <Typography.MonoText className="flex items-center gap-3 w-fit font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        <LanguageBlurFadeText enText="AI Assistant" idText="Asisten AI" delay={0.1} className="w-auto" />
                        <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent shrink-0"></span>
                    </Typography.MonoText>
                    <Typography.CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                        <LanguageBlurFadeText
                            delay={0.2}
                            enText="Portfolio AI Assistant"
                            idText="Asisten AI Portofolio"
                        />
                    </Typography.CardTitle>
                    <Typography.P className="text-xs sm:text-sm text-muted-foreground">
                        <LanguageBlurFadeText
                            delay={0.25}
                            enText="An interactive conversational AI trained on my portfolio, projects, and cybersecurity insights."
                            idText="AI percakapan interaktif yang dilatih dengan portofolio, proyek, dan wawasan keamanan siber saya."
                        />
                    </Typography.P>
                </div>
                <div data-lenis-prevent className="relative flex flex-col w-full h-150 sm:h-150 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl shadow-xl overflow-hidden transition-all">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/5 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Bot className="size-5" />
                                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background"></span>
                            </div>
                            <div className="flex flex-col text-left">
                                <div className="flex items-center gap-2">
                                    <Typography.P className="text-xs sm:text-sm font-semibold tracking-tight">AI Assistant</Typography.P>
                                    <Typography.MonoText className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <Sparkles className="size-2.5" />Ready
                                    </Typography.MonoText>
                                </div>
                                <Typography.P className="text-[12px] text-muted-foreground">
                                    <LanguageText
                                        enText="Model • Gemini Flash"
                                        idText="Model • Gemini Flash"
                                    />
                                </Typography.P>
                            </div>
                        </div>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <span className="inline-block">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={handleReset}
                                            aria-label="Reset conversation"
                                            disabled={messages.length === 0 && !input}
                                            className="rounded-full size-8 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                            <RotateCw className="size-3.5" />
                                        </Button>
                                    </span>
                                }
                            />
                            <TooltipContent>
                                <Typography.P className="text-xs">
                                    <LanguageText enText="Reset conversation" idText="Mulai ulang obrolan" />
                                </Typography.P>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <MessageScrollerProvider autoScroll>
                        <MessageScroller className="flex-1">
                            <MessageScrollerViewport className="p-4 sm:p-6">
                                <MessageScrollerContent className="gap-6 max-w-3xl mx-auto">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center my-auto">
                                            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
                                                <Sparkles className="size-6" />
                                            </div>
                                            <Typography.CardTitle className="text-base sm:text-lg font-semibold tracking-tight mb-6 sm:mb-8">
                                                <LanguageText
                                                    enText="What would you like to know about Albert Devada?"
                                                    idText="Apa yang ingin Anda ketahui tentang Albert Devada?"
                                                />
                                            </Typography.CardTitle>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl sm:max-w-2xl">
                                                {CHAT_SUGGESTION.map((item) => {
                                                    const Icon = item.icon;
                                                    const label = lang === "id" ? item.idText : item.en;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => handleSend(label)}
                                                            className="flex items-center gap-3 p-3.5 sm:p-4 text-left rounded-2xl border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs text-foreground group cursor-pointer">
                                                            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-primary group-hover:scale-105 transition-transform shrink-0">
                                                                <Icon className="size-4" />
                                                            </div>
                                                            <Typography.P className="leading-relaxed font-normal text-left text-xs wrap-break-words">
                                                                {label}
                                                            </Typography.P>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((message) => {
                                                if (message.role === "user") {
                                                    return (
                                                        <MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor>
                                                            <Message align="end">
                                                                <MessageContent className="items-end">
                                                                    <Bubble align="end" variant="default" className="rounded-2xl shadow-xs">
                                                                        <BubbleContent className="rounded-2xl px-4 py-2.5 text-xs sm:text-sm">
                                                                            {message.content}
                                                                        </BubbleContent>
                                                                    </Bubble>
                                                                    <Typography.P className="text-[10px] text-muted-foreground/60 px-1">
                                                                        {message.timestamp}
                                                                    </Typography.P>
                                                                </MessageContent>
                                                            </Message>
                                                        </MessageScrollerItem>
                                                    );
                                                }
                                                return (
                                                    <MessageScrollerItem key={message.id} messageId={message.id}>
                                                        <Message align="start">
                                                            <MessageAvatar className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                                                <Bot className="size-4" />
                                                            </MessageAvatar>
                                                            <MessageContent className="items-start max-w-[95%] sm:max-w-[90%]">
                                                                <Bubble align="start" variant="muted" className="rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-100/80 dark:bg-zinc-800/60 shadow-xs">
                                                                    <BubbleContent className="rounded-2xl px-4 py-3 text-xs sm:text-sm prose prose-neutral dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 leading-relaxed font-sans">
                                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                            {message.content}
                                                                        </ReactMarkdown>
                                                                    </BubbleContent>
                                                                </Bubble>
                                                                <Typography.P className="text-[10px] text-muted-foreground/60 px-1">
                                                                    {message.timestamp}
                                                                </Typography.P>
                                                            </MessageContent>
                                                        </Message>
                                                    </MessageScrollerItem>
                                                );
                                            })}
                                            {isThinking && (
                                                <MessageScrollerItem messageId="thinking-indicator">
                                                    <Message align="start">
                                                        <MessageAvatar className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                                            <Bot className="size-4 animate-pulse" />
                                                        </MessageAvatar>
                                                        <MessageContent className="items-start">
                                                            <Bubble align="start" variant="muted" className="rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-100/80 dark:bg-zinc-800/60">
                                                                <BubbleContent className="rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                                                    <Loader2 className="size-3.5 animate-spin text-primary" />
                                                                    <Typography.P>
                                                                        <LanguageText enText="Thinking..." idText="Berpikir..." />
                                                                    </Typography.P>
                                                                </BubbleContent>
                                                            </Bubble>
                                                        </MessageContent>
                                                    </Message>
                                                </MessageScrollerItem>
                                            )}
                                        </>
                                    )}
                                </MessageScrollerContent>
                            </MessageScrollerViewport>
                            <MessageScrollerButton />
                        </MessageScroller>
                    </MessageScrollerProvider>
                    <div className="p-3.5 sm:p-4 border-t border-black/5 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40">
                        <div className="relative flex items-center w-full max-w-3xl mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-background/90 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1.5 sm:p-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder={ lang === "id" ? "Tanyakan sesuatu tentang Albert..." : "Ask something about Albert..." }
                                className="flex-1 max-h-32 min-h-9.5 resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground/60 leading-relaxed font-sans"
                            />
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="default"
                                disabled={!input.trim() || isThinking}
                                onClick={() => handleSend()}
                                className="shrink-0 size-8 rounded-xl ml-1 transition-transform active:scale-95 disabled:opacity-30 cursor-pointer"
                                aria-label="Send message">
                                <ArrowUp className="size-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between max-w-3xl mx-auto mt-2 px-2 text-[10px] text-muted-foreground/70 font-mono">
                            <Typography.P>
                                <LanguageText
                                    enText="Shift + Enter for new line • Enter to send"
                                    idText="Shift + Enter baris baru • Enter untuk mengirim"
                                />
                            </Typography.P>
                            <Typography.P className="hidden sm:inline">Gemini Flash Architecture</Typography.P>
                        </div>
                    </div>
                </div>
            </BlurFade>
        </TooltipProvider>
    );
}
