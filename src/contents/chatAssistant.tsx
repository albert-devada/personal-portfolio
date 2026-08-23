"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage, LanguageText, LanguageBlurFadeText } from "@/language";
import { Badge, BlurFade, InteractiveHoverButton, appToast } from "@/components";
import { 
    MessageSquare, 
    Sparkles, 
    Clock, 
    ArrowLeft, 
    Send, 
    Bot, 
    Cpu,
    BookOpen,
    User,
    ArrowRight,
    ShieldCheck,
    Terminal,
    Loader2,
    Wand2,
    Construction
} from "lucide-react";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.03;

let msgIdCounter = 0;
const getMsgId = (prefix: string) => `${prefix}-${++msgIdCounter}`;
const IS_LIVE_API_ENABLED = false;
const CHAT_API_ENDPOINT = "/api/chat";

interface ChatMessage {
    id: string;
    sender: "ai" | "user";
    textEn: string;
    textId: string;
}

export function ChatAssistant() {
    const { lang } = useLanguage();
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "msg-init-1",
            sender: "ai",
            textEn: "Hello! I am Albert's AI Assistant. This feature is currently under active development and will be available soon!",
            textId: "Halo! Saya Asisten AI Albert. Fitur ini sedang dalam tahap pengembangan aktif dan akan segera hadir!"
        }
    ]);

    const samplePrompts = [
        {
            icon: ShieldCheck,
            enPrompt: "Cybersecurity Background",
            idPrompt: "Latar Belakang Keamanan Siber",
            enQuestion: "What is Albert's experience in cybersecurity?",
            idQuestion: "Apa pengalaman Albert di bidang keamanan siber?"
        },
        {
            icon: Cpu,
            enPrompt: "Tech Stack & Skills",
            idPrompt: "Keahlian & Tech Stack",
            enQuestion: "What tech stack does Albert use for backend?",
            idQuestion: "Tech stack apa yang digunakan Albert untuk backend?"
        },
        {
            icon: BookOpen,
            enPrompt: "Projects & Portfolio",
            idPrompt: "Proyek & Portofolio",
            enQuestion: "Tell me about Albert's key projects.",
            idQuestion: "Ceritakan proyek-proyek utama Albert."
        }
    ];

    const scrollToBottomInsideContainer = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottomInsideContainer();
    }, [messages, isTyping]);

    const handleSendMessage = async (customQuery?: { en: string; id: string }) => {
        const queryEn = customQuery ? customQuery.en : inputValue.trim();
        const queryId = customQuery ? customQuery.id : inputValue.trim();
        if (!queryEn && !queryId) return;

        const userMsg: ChatMessage = {
            id: getMsgId("usr"),
            sender: "user",
            textEn: queryEn,
            textId: queryId
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        if (IS_LIVE_API_ENABLED) {
            try {
                const response = await fetch(CHAT_API_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: queryEn, lang })
                });

                const data = await response.json();
                const aiReply: ChatMessage = {
                    id: getMsgId("ai"),
                    sender: "ai",
                    textEn: data.replyEn || data.reply || "Sorry, I couldn't process your request.",
                    textId: data.replyId || data.reply || "Maaf, saya tidak dapat memproses permintaan Anda."
                };
                setMessages(prev => [...prev, aiReply]);
            } catch (error) {
                console.error("Failed to connect to Chat API:", error);
                appToast.error(lang === "id" ? "Gagal terhubung ke AI Assistant. Menggunakan mode pengembangan." : "Failed to connect to AI Assistant. Reverting to dev mode.");
            } finally {
                setIsTyping(false);
            }
        } else {
            appToast.info(lang === "id" ? "Fitur dalam pengembangan, Terima kasih!." : "Feature under active development, Thanks!");
            setTimeout(() => {
                const aiReply: ChatMessage = {
                    id: getMsgId("ai"),
                    sender: "ai",
                    textEn: "This feature is currently under active development and will be available soon!",
                    textId: "Fitur ini sedang dalam tahap pengembangan aktif dan akan segera hadir!"
                };
                setMessages(prev => [...prev, aiReply]);
                setIsTyping(false);
            }, 600);
        }
    };

    return (
        <main className="items-center justify-center w-full gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <section id="chat-coming-soon" className="w-full">
                    <div className="flex flex-col gap-y-6 mt-10">
                        <div className="flex flex-col gap-y-1">
                            <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                <LanguageBlurFadeText enText="AI Assistant" idText="Asisten AI" delay={0.1} />
                                <span className="w-12 h-0.5 rounded-full bg-linear-to-r from-zinc-300 to-transparent dark:from-zinc-700 dark:to-transparent"></span>
                            </div>
                            <div className="text-xl md:text-2xl font-bold tracking-tight">
                                <LanguageBlurFadeText delay={0.2}
                                    enText="Chat Assistant" 
                                    idText="Asisten Chat" 
                                />
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                <LanguageBlurFadeText delay={0.25}
                                    enText="An interactive conversational AI trained on my portfolio, projects, and cybersecurity insights." 
                                    idText="AI percakapan interaktif yang dilatih dengan portofolio, proyek, dan wawasan keamanan siber saya." 
                                />
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-black/5 dark:bg-white/5 p-5 sm:p-8 flex flex-col items-center justify-center text-center">
                            <div className="absolute -top-24 -left-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <Badge className="mb-5 flex items-center gap-2 px-3.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors">
                                <Construction className="size-3.5 animate-pulse text-primary" />
                                <LanguageText enText="Under Active Development" idText="Sedang Dalam Pengembangan Aktif" />
                            </Badge>
                            <div className="relative size-14 sm:size-16 rounded-2xl bg-linear-to-b from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-md mb-5 group">
                                <MessageSquare className="size-7 sm:size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                                <Sparkles className="size-3.5 text-primary absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">
                                <LanguageText 
                                    enText="AI Chat Feature is Coming Soon" 
                                    idText="Fitur Chat AI Sedang Dikembangkan" 
                                />
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl sm:max-w-2xl mb-6 leading-relaxed">
                                <LanguageText 
                                    enText="This AI assistant feature is currently under active development and will be available soon." 
                                    idText="Fitur asisten AI ini sedang dalam tahap pengembangan aktif dan akan segera hadir." 
                                />
                            </p>
                            <div className="w-full max-w-lg md:max-w-xl rounded-xl border border-black/10 dark:border-white/10 bg-background/80 dark:bg-background/60 backdrop-blur-md p-4 sm:p-5 text-left shadow-sm mb-6">
                                <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-mono font-medium text-muted-foreground">
                                            <LanguageText enText="AI Assistant • Preview" idText="Asisten AI • Pratinjau" />
                                        </span>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">Version 1.0.0</span>
                                </div>
                                <div ref={chatContainerRef} className="space-y-3 max-h-56 sm:max-h-64 overflow-y-auto pr-1 mb-3.5 scroll-smooth">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.sender === "ai" && (
                                                <div className="size-7 sm:size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Bot className="size-3.5 sm:size-4 text-primary" />
                                                </div>
                                            )}
                                            <div className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[80%] 
                                                ${ msg.sender === "user"
                                                    ? "rounded-tr-xs bg-primary text-primary-foreground font-medium"
                                                    : "rounded-tl-xs bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-100 border border-black/5 dark:border-white/5"
                                                }`}>
                                                {lang === "id" ? msg.textId : msg.textEn}
                                            </div>
                                            {msg.sender === "user" && (
                                                <div className="size-7 sm:size-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <User className="size-3.5 sm:size-4 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="size-7 sm:size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <Bot className="size-3.5 sm:size-4 text-primary" />
                                            </div>
                                            <div className="p-2.5 sm:p-3 rounded-2xl rounded-tl-xs bg-black/5 dark:bg-white/10 text-xs sm:text-sm flex items-center gap-1.5 text-muted-foreground border border-black/5 dark:border-white/5">
                                                <Loader2 className="size-3.5 animate-spin text-primary" />
                                                <span>
                                                    <LanguageText enText="AI is typing..." idText="AI sedang mengetik..." />
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 mb-3 pt-2.5 border-t border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-mono mr-1">
                                        <Wand2 className="size-3 text-primary" />
                                        <LanguageText enText="Try asking:" idText="Coba tanya:" />
                                    </div>
                                    {samplePrompts.map((prompt, idx) => {
                                        const IconComp = prompt.icon;
                                        return (
                                            <button key={idx}
                                                onClick={() => handleSendMessage({ en: prompt.enQuestion, id: prompt.idQuestion })}
                                                disabled={isTyping}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-primary/10 hover:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer">
                                                <IconComp className="size-3" />
                                                <span>{lang === "id" ? prompt.idPrompt : prompt.enPrompt}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }} className="flex items-center gap-2 pt-1">
                                    <input type="text" value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={lang === "id" ? "Ketik pertanyaan simulasi di sini..." : "Type a simulation query here..."}
                                        className="w-full bg-black/5 dark:bg-white/5 text-xs sm:text-sm py-2 px-3.5 rounded-lg border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-900 dark:text-slate-100 placeholder:text-muted-foreground/70 transition-all"
                                    />
                                    <button type="submit" disabled={!inputValue.trim() || isTyping}
                                        className="py-2 px-3 sm:px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer">
                                        <Send className="size-3.5" />
                                        <span className="hidden sm:inline">
                                            <LanguageText enText="Send" idText="Kirim" />
                                        </span>
                                    </button>
                                </form>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mb-8 text-left">
                                <div className="p-3.5 sm:p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col gap-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                                    <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                                        <Cpu className="size-4" />
                                        <LanguageText enText="Smart Q&A" idText="Tanya Jawab Pintar" />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        <LanguageText 
                                            enText="Intelligent responses tailored to portfolio details." 
                                            idText="Jawaban cerdas berbasis detail rincian portofolio." 
                                        />
                                    </p>
                                </div>
                                <div className="p-3.5 sm:p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col gap-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                                    <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                                        <Terminal className="size-4" />
                                        <LanguageText enText="Knowledge Base" idText="Basis Pengetahuan" />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        <LanguageText 
                                            enText="Trained directly on technical writeups & cybersecurity blogs." 
                                            idText="Dilatih langsung dari catatan & artikel keamanan siber." 
                                        />
                                    </p>
                                </div>
                                <div className="p-3.5 sm:p-4 rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col gap-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                                    <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                                        <Clock className="size-4" />
                                        <LanguageText enText="Real-time AI" idText="Respon Real-time" />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        <LanguageText 
                                            enText="Fast answers powered by modern LLM architecture." 
                                            idText="Respon cepat ditenagai arsitektur LLM modern." 
                                        />
                                    </p>
                                </div>
                            </div>
                            <Link href="/">
                                <InteractiveHoverButton 
                                    icon={<ArrowLeft className="w-3.5 h-3.5" />}
                                    hoverIcon={<ArrowRight className="w-3.5 h-3.5" />}
                                    className="bg-transparent backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 rounded-xl">
                                    <LanguageText enText="Back to Portfolio" idText="Kembali ke Portofolio" />
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </div>
                </section>
            </BlurFade>
        </main>
    );
}
