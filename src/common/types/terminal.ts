import React from "react";
import { GeoLocationData } from "@/lib/utils";

export type ActiveContext = "none" | "help" | "certificate" | "certificate-detail" | "info";

export interface HistoryItem {
    type: "command" | "output";
    text: React.ReactNode;
}

export interface CommandContext {
    input: string;
    trimmedCommand: string;
    initialIp: string;
    geoData?: GeoLocationData | null;
    activeContext: ActiveContext;
    setActiveContext: (ctx: ActiveContext) => void;
    setIsExit: (exit: boolean) => void;
    setShowBanner: (show: boolean) => void;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
    setInput: (val: string) => void;
    setCursorPosition: (pos: number) => void;
}

export type CommandHandler = (ctx: CommandContext) => React.ReactNode | null | void;