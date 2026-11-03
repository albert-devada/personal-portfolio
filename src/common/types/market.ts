export interface BaseMarketItems {
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

export interface MarketChartMeta {
    meta: {
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
    };
    timestamp?: number[];
}

export interface MarketChartResponse {
    chart: { result: MarketChartMeta[] | null; error: unknown };
}

export interface MarketResponseItems {
    id: string;
    name?: string;
    symbol: string;
    image?: string;
    amount?: number;
    base?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    rates: Record<
        string,
        {
            AUD: number;
            EUR: number;
            GBP: number;
            IDR: number;
            JPY: number;
            SGD: number;
            [currency: string]: number;
        }
    >;
    shortName?: string;
    displayName: string;
    longName?: string;
    current_price?: number;
    price_change_percentage_24h?: number;
    regularMarketPrice?: { raw?: number } | number;
    regularMarketChangePercent?: { raw?: number } | number;
    [key: string]: unknown;
}

export interface PlaygroundMarketProps {
    items: BaseMarketItems[];
    isLoading?: boolean;
}

export interface MarketResponseItems {
    success: boolean;
    meta?: Record<string, unknown>;
    data: {
        crypto?: BaseMarketItems[];
        stocks?: BaseMarketItems[];
        currency?: BaseMarketItems[];
        energy?: BaseMarketItems[];
    };
    error?: string;
    timestamp?: string;
}