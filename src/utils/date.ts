/**
 * Formats a general date string or Date object with full day, month, and year.
 */
export function formatDate(date: string | Date | null | undefined, localeOrLang: "en" | "id" | "en-US" | "id-ID" = "en"): string {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return typeof date === "string" ? date : "";

    const locale = localeOrLang === "id" || localeOrLang === "id-ID" ? "id-ID" : "en-US";
    return dateObj.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Formats ping / telemetry timestamp with localized date, time, and timezone notation.
 * - English: "Oct 31, 2026 at 01:23:45 AM"
 * - Indonesian: "31 Okt 2026 pada 01.23.45 WIB"
 */
export function formatDateTime(date: Date | string | null | undefined, currentLang: string = "en"): string {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";

    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    if (currentLang === "en") {
        const datePart = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(dateObj);
        const formattedHours = String(hours % 12 || 12).padStart(2, "0");
        return `${datePart} at ${formattedHours}:${minutes}:${seconds} ${period}`;
    } else {
        const datePart = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(dateObj);
        const formattedHours = String(hours).padStart(2, "0");
        return `${datePart} pada ${formattedHours}.${minutes}.${seconds} WIB`;
    }
}

/**
 * Formats a date string to Month and Year (e.g. "May 2024" or "Mei 2024").
 */
export function formatMonthYear(dateString: string | null | undefined, lang: "en" | "id" = "en"): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        month: "long",
        year: "numeric",
    });
}

/**
 * Normalizes and formats experience dates to YYYY-MM-DD format.
 * Parses multi-language month abbreviations (Indonesian and English).
 */
export const formatExperienceDate = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const months: Record<string, string> = {
        jan: "01", feb: "02", mar: "03", apr: "04", mei: "05", may: "05", 
        jun: "06", jul: "07", aug: "08", ags: "08", sep: "09", oct: "10", 
        okt: "10", nov: "11", dec: "12", des: "12"
    };
    const cleanStr = dateStr.toLowerCase().replace(/,/g, "");
    const parts = cleanStr.split(" ");
    if (parts.length === 3) {
        const month = months[parts[0].substring(0, 3)] || "01";
        const day = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};

/**
 * Formats education period date strings for display.
 * Returns localized "Present" / "Sekarang" if the period is undefined or ongoing.
 */
export function formatEducationPeriod(dateString: string | null | undefined, lang: "en" | "id" = "en"): string {
    if (!dateString) {
        return lang === "id" ? "Sekarang" : "Present";
    }

    return formatMonthYear(dateString, lang);
}

/**
 * Formats time to 2-digit hour and minute (e.g. "14:30" or "02:30 PM").
 * Defaults to current local time if no date is provided.
 */
export function formatCurrentTime(date?: Date | string | null): string {
    const dateObj = date ? (typeof date === "string" ? new Date(date) : date) : new Date();
    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
    return validDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}