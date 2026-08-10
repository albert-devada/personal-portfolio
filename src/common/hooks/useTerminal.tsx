import React, { useState, useEffect, useRef } from "react";
import { GeoLocationData } from "@/lib/utils";
import { ActiveContext, HistoryItem } from "../types/terminal";
import { executeCommand } from "./registryTerminal";

export function useTerminal(initialIp: string, geoData?: GeoLocationData | null) {
    const [input, setInput] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showBanner, setShowBanner] = useState(true);
    const [isExit, setIsExit] = useState(false);
    const [lastLoginTime, setLastLoginTime] = useState("Sun Jul 12 06:05:12 2026");
    const [kaliVersion, setKaliVersion] = useState("2026.2");
    const [kernelVersion, setKernelVersion] = useState("6.12.0-kali-amd64 x86_64");
    const [activeContext, setActiveContext] = useState<ActiveContext>("none");
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const date = new Date();
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            const formattedDate = `${days[date.getDay()]} ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${date.getFullYear()}`;
            setLastLoginTime(formattedDate);

            const currentYear = date.getFullYear();
            const currentQuarter = Math.floor(date.getMonth() / 3) + 1;
            setKaliVersion(`${currentYear}.${currentQuarter}`);

            if (currentYear > 2026) {
                const majorDiff = currentYear - 2026;
                setKernelVersion(`${6 + Math.floor(majorDiff / 2)}.${12 + (majorDiff % 2)}.0-kali-amd64 x86_64`);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (history.length > 0 && terminalEndRef.current) {
            const container = terminalEndRef.current.parentElement;
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth"
                });
            }
        }
    }, [history]);

    const handleTerminalClick = () => {
        if (!isExit) {
            inputRef.current?.focus();
        }
    };

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedCommand = input.trim().toLowerCase();

        if (!trimmedCommand) return;

        const updatedCmdHistory = [...cmdHistory, input];
        setCmdHistory(updatedCmdHistory);
        setHistoryIndex(updatedCmdHistory.length);

        const newHistory: HistoryItem[] = [
            ...history,
            {
                type: "command",
                text: isExit ? (
                    <div className="text-xs sm:text-sm mt-2 flex items-center gap-1 text-zinc-400 select-none">
                        <span>user@local-pc:~$</span>
                        <span className="text-[#e0e0e0] ml-1 select-text">{input}</span>
                    </div>
                ) : (
                    <div className="text-xs sm:text-sm mt-2 select-none">
                        <div className="text-[#00c875]">
                            ┌──(<span className="text-[#00b0ff]">naufal㉿kali</span>)-[<span className="text-[#e0e0e0]">~/.env</span>]
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[#00c875]">└─<span className="text-[#00b0ff] ml-1">$</span></span>
                            <span className="text-[#e0e0e0] ml-2 select-text">{input}</span>
                        </div>
                    </div>
                )
            }
        ];

        if (isExit) {
            if (trimmedCommand === "ssh") {
                setIsExit(false);
                setShowBanner(true);
                setHistory([]);
                setInput("");
                setCursorPosition(0);
                setActiveContext("none");
                return;
            } else {
                newHistory.push({
                    type: "output",
                    text: <div className="text-[#ff5555] text-xs sm:text-sm">bash: {input}: command not found. Type &apos;ssh&apos; to reconnect.</div>
                });
                setHistory(newHistory);
                setInput("");
                return;
            }
        }

        const outputNode = await executeCommand({
            input,
            trimmedCommand,
            initialIp,
            geoData,
            activeContext,
            setActiveContext,
            setIsExit,
            setShowBanner,
            setHistory,
            setInput,
            setCursorPosition,
        });

        if (outputNode !== null && outputNode !== undefined) {
            newHistory.push({
                type: "output",
                text: outputNode
            });
            setHistory(newHistory);
        }

        setInput("");
        setCursorPosition(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault(); 
            if (cmdHistory.length === 0) return;

            const newIndex = Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            const targetCommand = cmdHistory[newIndex];
            setInput(targetCommand);
            setCursorPosition(targetCommand.length); 
        } 
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (cmdHistory.length === 0) return;

            const newIndex = Math.min(cmdHistory.length, historyIndex + 1);
            setHistoryIndex(newIndex);

            if (newIndex === cmdHistory.length) {
                setInput("");
                setCursorPosition(0);
            } else {
                const targetCommand = cmdHistory[newIndex];
                setInput(targetCommand);
                setCursorPosition(targetCommand.length);
            }
        }
    };

    return {
        input,
        setInput,
        cursorPosition,
        setCursorPosition,
        history,
        showBanner,
        ipAddress: initialIp,
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
    };
}