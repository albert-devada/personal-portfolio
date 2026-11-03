import React from "react";
import { GeoLocationData } from "./geolocation";
import type { PersonalProfile } from "./navigation";

export type ActiveContext = "none" | "help" | "certificate" | "certificate-detail" | "info";

export interface HistoryItem {
    type: "command" | "output";
    text: React.ReactNode;
}

export type CertificationRawItem = Record<string, string | number | boolean | null | undefined>;

export interface CertificateItem {
    id: string;
    title: string;
    path: string;
    url?: string | null;
    borderColor?: string;
}

export type ExperienceRawItem = Record<string, string | number | boolean | null | undefined>;

export interface FormattedExperience {
    released: string;
    title: string;
    vendor: string;
    description_en: string;
    description_id: string;
}

export type EducationRawItem = Record<string, string | number | boolean | null | undefined>;

export interface TerminalInitialData {
    profile?: PersonalProfile | null;
    certificates?: CertificationRawItem[];
    experiences?: ExperienceRawItem[];
    education?: EducationRawItem[];
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
    initialData?: TerminalInitialData;
}

export type CommandHandler = (ctx: CommandContext) => React.ReactNode | null | void;

export interface SSHTerminalProps {
    visitorIp: string;
    geoData: GeoLocationData | null;
    initialData?: TerminalInitialData;
}