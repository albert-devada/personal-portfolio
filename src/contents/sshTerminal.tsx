"use client";

import { useTerminal } from "@/common/hooks";
import type { SSHTerminalProps, HistoryItem } from "@/common/types";
import { useLanguage } from "@/language";
import { useEffect, useState } from "react";
import { formatCertificateData } from "@/function";
import { formatEducationPeriod } from "@/utils";

export function SSHTerminal({ visitorIp, geoData, initialData }: SSHTerminalProps) {
    const { lang } = useLanguage();
    const [certReady, setCertReady] = useState<boolean>(false);
    const {
        input,
        setInput,
        cursorPosition,
        setCursorPosition,
        history,
        showBanner,
        ipAddress,
        isExit,
        lastLoginTime,
        kaliVersion,
        kernelVersion,
        activeContext,
        inputRef,
        terminalEndRef,
        handleTerminalClick,
        handleCommandSubmit,
        handleKeyDown,
    } = useTerminal(visitorIp, geoData, initialData);

    const rawEdu = initialData?.education || [];
    const educationList = rawEdu.length > 0
        ? [...rawEdu].sort((a, b) => {
            if (!a.period && !b.period) return 0;
            if (!a.period) return -1;
            if (!b.period) return 1;
            return new Date(String(b.period)).getTime() - new Date(String(a.period)).getTime();
        })
        : [];

    const certs = initialData?.certificates || [];
    const certCount = certs.length > 0 ? formatCertificateData(certs).length : 0;

    const getAvailableCommands = () => {
        if (isExit) {
            return ["ssh"];
        }
        if (activeContext === "certificate") {
            if (!certReady || certCount === 0) {
                return ["back", "clear", "exit"];
            }
            const numberCmds = Array.from({ length: certCount }, (_, i) => String(i + 1));
            return [...numberCmds, "back", "clear", "exit"];
        }
        if (activeContext === "certificate-detail") {
            return ["back", "clear", "exit"];
        }
        if (activeContext === "info") {
            return ["back", "clear", "exit"];
        }
        if (activeContext === "help") {
            return ["neofetch", "whoami", "ifconfig", "certificate", "experience", "contact", "ls", "clear"];
        }
        return ["help", "clear", "exit"];
    };

    const availableCommands = getAvailableCommands();

    const handleQuickClick = (cmd: string) => {
        setInput(cmd);
        setCursorPosition(cmd.length);
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
            setTimeout(() => {
                inputRef.current?.form?.requestSubmit();
            }, 30);
        }
    };

    useEffect(() => {
        if (activeContext === "certificate") {
            const timer = setTimeout(() => {
                setCertReady(true);
            }, 1250);
            return () => {
                setCertReady(false);
                clearTimeout(timer);
            };
        }
    }, [activeContext]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, [isExit, inputRef]);

    return (
        <div className="relative w-full max-w-3xl mx-auto group mt-8 sm:mt-12 font-mono">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
            <div onClick={handleTerminalClick} className="relative rounded-xl bg-[#18191a] border border-white/10 shadow-xl overflow-hidden cursor-text">
                <div className="flex items-center px-4 py-2 border-b border-white/5 bg-[#111213] select-none">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="mx-auto text-[11px] sm:text-xs text-zinc-400 font-medium select-none">
                        {isExit ? "user@local-pc:~" : "naufal@kali: ~/.env (ssh)"}
                    </div>
                </div>
                <div className="px-4 py-3 sm:px-5 sm:py-5 text-xs sm:text-sm text-[#d1d5db] overflow-x-auto h-85 sm:h-100 overflow-y-auto whitespace-pre subpixel-antialiased tracking-normal leading-[1.35]">
                    {showBanner && (
                        <div className="space-y-1.5 text-[#d1d5db]">
                            <div>Welcome to Kali GNU/Linux Rolling {kaliVersion} (GNU/Linux {kernelVersion})</div>
                            <div>Last login: <span className="text-[#d5dc82] font-normal">{lastLoginTime}</span> from <span className="text-[#d5dc82] font-semibold">{ipAddress}</span></div>
                            <div className="text-[#00b0ff]">[-] Portfolio environment loaded.</div>
                            {educationList.length > 0 ? (
                                <>
                                    <div className="pt-2 font-bold text-[#a7a6a6]">
                                        {lang === "id" ? "Jalur Akademik:" : "Academic Pathway:"}
                                    </div>
                                    {educationList.map((item, index) => (
                                        <div key={String(item.id ?? index)} className="mt-1.5 ml-2">
                                            <div className="text-[#00c875] font-bold">
                                                [+] {item[`institution_${lang}`]}
                                            </div>
                                            <div className="pl-5 text-[#d1d5db]">
                                                <span className="text-zinc-500 font-normal">
                                                    {lang === "id" ? "- Jurusan : " : "- Major   : "}
                                                </span>
                                                {item[`major_${lang}`]}
                                            </div>
                                            <div className="pl-5 text-[#d1d5db]">
                                                <span className="text-zinc-500 font-normal">
                                                    {lang === "id" ? "- Periode : " : "- Period  : "}
                                                </span>
                                                {formatEducationPeriod(item.period as string | null | undefined, lang)}
                                            </div>
                                            <div className="pl-5 text-[#d1d5db]">
                                                <span className="text-zinc-500 font-normal">
                                                    - Status  :&nbsp;
                                                </span>
                                                {item[`status_${lang}`]}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="pt-2 text-[#ff5555] ml-2">
                                    {lang === "id" 
                                        ? "[!] Data jalur akademik tersedia." 
                                        : "[!] Academic pathway is not loaded."}
                                </div>
                            )}
                            <div className="text-[#e6c662] pt-5">
                                {lang === "id"
                                    ? "[?] Ketik 'help' atau 'clear'."
                                    : "[?] Type 'help' or 'clear'."}
                            </div>
                        </div>
                    )}
                    {history.map((item: HistoryItem, index: number) => (
                        <div key={index}>{item.text}</div>
                    ))}
                    <form onSubmit={handleCommandSubmit} className="mt-5">
                        {isExit ? (
                            <div className="flex items-center gap-1 text-zinc-400 select-none">
                                <span>user@local-pc:~$</span>
                                <div className="relative flex items-center flex-1 ml-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            setCursorPosition(e.target.selectionStart || 0);
                                        }}
                                        onSelect={(e) => {
                                            setCursorPosition(e.currentTarget.selectionStart || 0);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        className="w-full bg-transparent text-[#e0e0e0] outline-hidden border-none focus:ring-0 p-0 text-xs sm:text-sm caret-transparent selection:bg-zinc-500/30 z-10"
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <div className="absolute left-0 top-0 bottom-0 pointer-events-none text-xs sm:text-sm flex items-center tracking-normal z-0 whitespace-pre">
                                        <span className="opacity-0">{input.slice(0, cursorPosition)}</span>
                                        <span className="animate-pulse w-2 h-4 bg-zinc-200/50 inline-block" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-[#00c875] select-none">
                                    ┌──(<span className="text-[#00b0ff]">naufal㉿kali</span>)-[<span className="text-[#e0e0e0]">~/.env</span>]
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#00c875] select-none">└─<span className="text-[#00b0ff] ml-1">$</span></span>
                                    <div className="relative flex items-center flex-1 ml-1">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                setCursorPosition(e.target.selectionStart || 0);
                                            }}
                                            onSelect={(e) => {
                                                setCursorPosition(e.currentTarget.selectionStart || 0);
                                            }}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-transparent text-[#e0e0e0] outline-hidden border-none focus:ring-0 p-0 text-xs sm:text-sm caret-transparent selection:bg-zinc-500/30 z-10"
                                            autoComplete="off"
                                            spellCheck="false"
                                        />
                                        <div className="absolute left-0 top-0 bottom-0 pointer-events-none text-xs sm:text-sm flex items-center tracking-normal z-0 whitespace-pre">
                                            <span className="opacity-0">{input.slice(0, cursorPosition)}</span>
                                            <span className="animate-pulse w-2 h-4 bg-zinc-200/50 inline-block" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                    <div ref={terminalEndRef} />
                </div>
                {/* Quick Command Bar for Mobile & iPad (Sleek & Perfectly Fitted Size) */}
                <div className="flex pointer-fine:hidden hover:hidden items-center gap-1.5 px-3 py-1.5 border-t border-white/10 bg-[#111213] overflow-x-auto select-none no-scrollbar">
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase shrink-0 px-0.5">Quick:</span>
                    {availableCommands.map((cmd) => {
                        const isBack = cmd === "back";
                        const isNumber = !isNaN(Number(cmd));

                        let btnStyle = "bg-white/5 hover:bg-white/15 text-zinc-200 border-white/10";
                        if (isBack) {
                            btnStyle = "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border-yellow-500/25 font-medium";
                        } else if (isNumber) {
                            btnStyle = "bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/25 font-medium";
                        }

                        return (
                            <button
                                key={cmd}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickClick(cmd);
                                }}
                                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all shrink-0 cursor-pointer flex items-center gap-1 touch-manipulation active:scale-95 ${btnStyle}`}
                            >
                                <span className={isBack ? "text-yellow-400" : isNumber ? "text-blue-400" : "text-[#00c875] font-bold"}>
                                    {isBack ? "←" : "$"}
                                </span>
                                <span>{cmd}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}