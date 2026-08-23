import { CVEDataItem, CVEApiResponse, CVEMetrics } from "@/common/types";

function get24HoursRangeISO(): { pubStartDate: string; pubEndDate: string } {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    return { pubStartDate: startDate.toISOString(), pubEndDate: endDate.toISOString() };
}

function extractCVEMetrics(metrics?: CVEMetrics): { severity: string; score: number | null } {
    if (!metrics) return { severity: "UNASSESSED", score: null };
    const cvssV31 = metrics.cvssMetricV31?.[0]?.cvssData;
    if (cvssV31) return { severity: cvssV31.baseSeverity || "UNASSESSED", score: cvssV31.baseScore ?? null };
    const cvssV30 = metrics.cvssMetricV30?.[0]?.cvssData;
    if (cvssV30) return { severity: cvssV30.baseSeverity || "UNASSESSED", score: cvssV30.baseScore ?? null };
    const cvssV40 = metrics.cvssMetricV40?.[0]?.cvssData;
    if (cvssV40) return { severity: cvssV40.baseSeverity || "UNASSESSED", score: cvssV40.baseScore ?? null };
    const cvssV2 = metrics.cvssMetricV2?.[0];
    if (cvssV2) return { severity: cvssV2.baseSeverity || "UNASSESSED", score: cvssV2.cvssData?.baseScore ?? null };
    return { severity: "UNASSESSED", score: null };
}

export async function fetchCVEData(): Promise<CVEDataItem[]> {
    const { pubStartDate, pubEndDate } = get24HoursRangeISO();
    const baseUrl = process.env.CVE_API_URL || "YOUR_API_URL";
    const apiUrl = `${baseUrl}?pubStartDate=${encodeURIComponent(pubStartDate)}&pubEndDate=${encodeURIComponent(pubEndDate)}`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 7200 },
        });

        if (!response.ok) {
            console.error(`[CVE_SERVICE] API error: ${response.status}`);
            return [];
        }

        const data: CVEApiResponse = await response.json();
        const vulnerabilities = data.vulnerabilities || [];

        const cveList = vulnerabilities.map((item) => {
            const cve = item.cve;
            if (!cve) return null;
            const englishDesc = cve.descriptions?.find((d) => d.lang === "en")?.value || cve.descriptions?.[0]?.value || "No description available.";
            const vendor = cve.affected?.[0]?.affectedData?.[0]?.vendor || "Unknown";
            const status = cve.vulnStatus || "N/A";
            const { severity, score } = extractCVEMetrics(cve.metrics);
            const reference = cve.references?.[0]?.url || "";
            const cveItems: CVEDataItem = {
                cveId: cve.id || "N/A",
                published: cve.published || "",
                vendor,
                status,
                severity,
                score,
                description: englishDesc,
                reference,
            };

            return cveItems;
        });

        const results = cveList.filter((item): item is CVEDataItem => item !== null);
        return results.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()).slice(0, 50); 

    } catch (error) {
        console.error("[CVE_SERVICE] Failed to fetch CVE data:", error);
        return [];
    }
}

export async function fetchCVESearch(cveId: string): Promise<CVEDataItem[]> {
    const cleanCveId = cveId.trim().toUpperCase();
    if (!cleanCveId) return [];
    const baseUrl = process.env.CVE_API_URL || "YOUR_API_URL";
    const apiUrl = `${baseUrl}?cveId=${encodeURIComponent(cleanCveId)}`;

    try {
        const response = await fetch(apiUrl, {
            headers: { Accept: "application/json" },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(`[CVE_SERVICE] Search API error: ${response.status}`);
            return [];
        }

        const data: CVEApiResponse = await response.json();
        const vulnerabilities = data.vulnerabilities || [];

        const cveList = vulnerabilities.map((item) => {
            const cve = item.cve;
            if (!cve) return null;
            const englishDesc = cve.descriptions?.find((d) => d.lang === "en")?.value || cve.descriptions?.[0]?.value || "No description available.";
            const vendor = cve.affected?.[0]?.affectedData?.[0]?.vendor || "Unknown";
            const status = cve.vulnStatus || "N/A";
            const { severity, score } = extractCVEMetrics(cve.metrics);
            const reference = cve.references?.[0]?.url || "";
            const cveItems: CVEDataItem = {
                cveId: cve.id || "N/A",
                published: cve.published || "",
                vendor,
                status,
                severity,
                score,
                description: englishDesc,
                reference,
            };

            return cveItems;
        });

        return cveList.filter((item): item is CVEDataItem => item !== null);

    } catch (error) {
        console.error("[CVE_SERVICE] Failed to fetch CVE search data:", error);
        return [];
    }
}