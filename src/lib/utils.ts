import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

export interface GeoLocationData {
    ip: string;
    success: boolean;
    type: string;
    continent: string;
    continent_code: string;
    country: string;
    country_code: string;
    region: string;
    region_code: string;
    city: string;
    latitude: number;
    longitude: number;
    is_eu: boolean;
    postal: string | null;
    calling_code: string;
    capital: string;
    borders: string;
    flag: {
        img: string;
        emoji: string;
        emoji_unicode: string;
    };
    connection: {
        asn: number;
        org: string;
        isp: string;
        domain: string;
    };
    timezone: {
        id: string;
        abbr: string;
        is_dst: boolean;
        offset: number;
        utc: string;
    };
    readme: string;
}

export interface VisitorDetails {
    ipAddress: string;
    userAgent: string;
    GeoLocationData: GeoLocationData | null;
}