import React from "react";

export type ToolTab =
    | "location"
    | "server"
    | "cvedata"
    | "exploited"
    | "breach"
    | "jsonformatter"
    | "encoder"
    | "market"
    | "exchanges";

export interface ToolItem {
    id: ToolTab;
    nameEn: string;
    nameId: string;
    icon: React.ElementType;
    categoryEn: string;
    categoryId: string;
}

export interface ServiceHealth {
    status: string;
    latency: string;
}

export interface HealthResponseData {
    status: string;
    services: {
        server: ServiceHealth;
        database: ServiceHealth;
        ai_model: ServiceHealth;
    };
}

export interface HealthApiResponse {
    success: boolean;
    data?: HealthResponseData;
    error?: string;
    timestamp?: string;
}

export interface CVEData {
    baseScore?: number;
    baseSeverity?: string;
}

export interface CVEMetricItem {
    cvssData?: CVEData;
    baseSeverity?: string;
}

export interface CVEMetrics {
    cvssMetricV31?: CVEMetricItem[];
    cvssMetricV30?: CVEMetricItem[];
    cvssMetricV40?: CVEMetricItem[];
    cvssMetricV2?: CVEMetricItem[];
}

export interface CVEDescription {
    lang: string;
    value: string;
}

export interface CVEWeakness {
    description?: CVEDescription[];
}

export interface CVEAffectedData {
    vendor?: string;
}

export interface CVEAffected {
    affectedData?: CVEAffectedData[];
}

export interface CVEReference {
    url?: string;
}

export interface CVEItem {
    id?: string;
    published?: string;
    vulnStatus?: string;
    descriptions?: CVEDescription[];
    affected?: CVEAffected[];
    weaknesses?: CVEWeakness[];
    metrics?: CVEMetrics;
    references?: CVEReference[];
}

export interface CVEItemVulnerability {
    cve?: CVEItem;
}

export interface CVEApiResponse {
    vulnerabilities?: CVEItemVulnerability[];
}

export interface CVEDataItem {
    cveId: string;
    published: string;
    vendor: string;
    status: string;
    severity: string;
    score: number | null;
    description: string;
    reference: string;
}

export interface exploitedItem {
    cveID: string;
    vendorProject: string;
    product: string;
    vulnerabilityName: string;
    dateAdded: string;
    shortDescription: string;
    requiredAction: string;
    dueDate: string;
    knownRansomwareCampaignUse: "Known" | "Unknown" | string;
    notes?: string;
    cwes?: string[];
}

export interface BreachItem {
    Name: string;
    Title: string;
    Domain: string | null;
    Industry?: string;
    Reference?: string;
    BreachDate: string;
    AddedDate?: string;
    ModifiedDate?: string;
    PwnCount: number;
    Description: string;
    LogoPath: string;
    DataClasses: string[];
    IsVerified: boolean;
    IsFabricated?: boolean;
    IsSensitive?: boolean;
    IsRetired?: boolean;
    IsSpamList?: boolean;
    IsMalware?: boolean;
    IsSubscriptionFree?: boolean;
    IsStealerLog?: boolean;
}

export interface MarketChartMeta {
    currency: string;
    symbol: string;
    exchangeName?: string;
    fullExchangeName?: string;
    instrumentType?: string;
    regularMarketPrice: number;
    chartPreviousClose?: number;
    previousClose?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
}

export interface MarketChartResult {
    meta: MarketChartMeta;
    timestamp?: number[];
}

export interface MarketChartResponse {
    chart: { result: MarketChartResult[] | null; error: unknown };
}

export interface BaseMarketItem {
    id: string;
    name: string;
    symbol: string;
    main_price: string;
    sub_text: string;
    price_change_percentage_24h: number;
    image?: string;
    icon?: React.ElementType;
    iconColor?: string;
}

export interface NewsArticleItem {
    id: string;
    badge: string;
    date: string;
    title: string;
    description: string;
    imageUrl?: string;
    ticker?: string | string[];
    url: string;
    sentiment?: string;
}

export interface TabMarket<item = BaseMarketItem> {
    value: string;
    labelEn: string;
    labelId: string;
    type?: "grid" | "news";
    items?: item[];
    newsItems?: NewsArticleItem[];
    isLoading?: boolean;
}

export interface MarketData {
    crypto: BaseMarketItem[];
    stocks: BaseMarketItem[];
    sentiment: NewsArticleItem[];
}

export interface ExchangeData {
    currency: BaseMarketItem[];
    energy: BaseMarketItem[];
    metals: BaseMarketItem[];
}

export interface MarketWatchResponse {
    success: boolean;
    meta?: Record<string, unknown>;
    data?: MarketData;
    error?: string;
    timestamp?: string;
}

export interface MarketExchangeResponse {
    success: boolean;
    meta?: Record<string, unknown>;
    data?: ExchangeData;
    error?: string;
    timestamp?: string;
}
