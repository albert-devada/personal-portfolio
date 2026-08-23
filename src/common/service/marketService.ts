import { NewsArticleItem } from "@/common/types";

interface TickerSentiment {
    ticker: string;
    relevance_score?: string;
    ticker_sentiment_score?: string;
    ticker_sentiment_label?: string;
}

interface NewsFeedItem {
    title?: string;
    url?: string;
    time_published?: string;
    authors?: string[];
    summary?: string;
    banner_image?: string | null;
    source?: string;
    category_within_source?: string;
    source_domain?: string;
    overall_sentiment_score?: number;
    overall_sentiment_label?: string;
    ticker_sentiment?: TickerSentiment[];
}

export async function fetchMarketNewsData(): Promise<NewsArticleItem[]> {
    const apiKey = process.env.MARKET_NEWS_API_KEY || "YOUR_API_KEY";
    const apiUrl = `${process.env.URL_MARKET_NEWS_API}?function=NEWS_SENTIMENT&topics=financial_markets,blockchain&sort=LATEST&limit=50&apikey=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 21600 },
        });

        if (!response.ok) {
            throw new Error(`[MARKET_SERVICE] API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.feed || !Array.isArray(data.feed)) {
            console.warn("[MARKET_SERVICE] Doesn't have an array 'feed' in the response.");
            return [];
        }
        
        const newsItems: NewsArticleItem[] = data.feed.slice(0, 50).map(
            (item: NewsFeedItem, index: number) => {
                const tickers = item.ticker_sentiment ? item.ticker_sentiment.map((t) => t.ticker) : [];

                return {
                    id: item.url || `${item.time_published}-${index}`,
                    badge: item.source || "Market News",
                    date: item.time_published || "",
                    title: item.title || "",
                    description: item.summary || "",
                    imageUrl: item.banner_image || "covernews.jpg",
                    ticker: tickers,
                    url: item.url || "#",
                    sentiment: item.overall_sentiment_label || "Neutral",
                };
            }
        );

        return newsItems;
    } catch (error) {
        console.error("[MARKET_SERVICE] Failed to fetch market news data:", error);
        return [];
    }
}