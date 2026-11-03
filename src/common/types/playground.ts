import React from "react";
import type { GeoLocationData } from "./geolocation";

export type PlaygroundMenu = "location" | "server" | "exploited" | "breach" | "market" | "exchanges";

export interface PlaygroundMenuItems {
    id: PlaygroundMenu;
    nameEn: string;
    nameId: string;
    icon: React.ElementType;
    descriptionEn?: string;
    descriptionId?: string;
    categoryEn?: string;
    categoryId?: string;
}

export interface PlaygroundCategoryGroup {
    categoryEn: string;
    categoryId: string;
    tools: PlaygroundMenuItems[];
}

export interface PlaygroundPageProps {
    params?: PlaygroundMenu | Promise<{ tab?: PlaygroundMenu; id?: PlaygroundMenu }>;
    searchParams?: Promise<{ tab?: PlaygroundMenu }>;
}

export interface PlaygroundToolsProps {
    activeTab?: PlaygroundMenu;
    visitorIp: string;
    userAgent?: string;
    geoData?: GeoLocationData | null;
}

export interface ServiceHealthItems {
    status: string;
    latency: string;
}

export interface HealthResponseData {
    status: string;
    services: {
        server: ServiceHealthItems;
        database: ServiceHealthItems;
        ai_model: ServiceHealthItems;
    };
}

export interface HealthResponse {
    success: boolean;
    data?: HealthResponseData;
    error?: string;
    timestamp?: string;
}

export interface GenericTabItems<T> {
    value: string;
    labelEn: string;
    labelId: string;
    items: T[];
    isLoading: boolean;
}

export interface GenericTabsProps<T> {
    tabs: GenericTabItems<T>[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    descriptionEn: string;
    descriptionId: string;
    renderContent?: (tab: GenericTabItems<T>) => React.ReactNode; 
}