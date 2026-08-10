import { BreachItem } from "@/common/types/playgorund";

interface XposedBreachDetail {
    breach: string;
    details: string;
    domain: string;
    industry: string;
    logo: string;
    references: string;
    verified: string;
    xposed_data: string;
    xposed_date: string;
    xposed_records: number;
    added: string;
}

function extractReferenceUrl(references?: string, details?: string): string {
    const urlRegex = /https?:\/\/[^\s"'>]+/i;
    const target = references || details || "";
    const match = target.match(urlRegex) || details?.match(/href=["'](https?:\/\/[^"']+)["']/i);
    return match ? (match[1] || match[0]).replace(/[.,;)]+$/, "") : "";
}

export async function fetchBreachData(email: string): Promise<BreachItem[]> {
    const apiUrl = `${process.env.BREACH_API_URL}/breach-analytics?email=${encodeURIComponent(email)}` || "YOUR_API_URL";
    
    const response = await fetch(apiUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`[BREACH_SERVICE] API Error status: ${response.status}`,);
    }

    const data = await response.json().catch(() => null);

    if (data && "ExposedBreaches" in data && data.ExposedBreaches === null) {
        return [];
    }

    if (!data || !("ExposedBreaches" in data) || !data.ExposedBreaches?.breaches_details) {
        throw new Error(`[BREACH_SERVICE] Doesn't have an array 'breaches_details' in the response.`,);
    }

    const formattedBreaches: BreachItem[] = 
    
        data.ExposedBreaches.breaches_details.map((b: XposedBreachDetail) => ({
            Name: b.breach,
            Title: b.breach,
            Domain: b.domain || "N/A",
            Industry: b.industry || "N/A",
            Reference: extractReferenceUrl(b.references, b.details),
            BreachDate: b.xposed_date ? `${b.xposed_date}-01-01` : "",
            AddedDate: b.added || "",
            ModifiedDate: b.added || "",
            PwnCount: b.xposed_records || 0,
            Description: b.details || "",
            LogoPath: b.logo || "",
            DataClasses: b.xposed_data ? b.xposed_data.split(/;|,/).map((item) => item.trim()) : [],
            IsVerified: b.verified === "Yes",
            IsFabricated: false,
            IsSensitive: false,
            IsRetired: false,
            IsSpamList: false,
            IsMalware: false,
            IsSubscriptionFree: true,
            IsStealerLog: false,
        })
    );
    
    return formattedBreaches;
}
