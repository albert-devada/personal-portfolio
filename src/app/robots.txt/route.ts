import { Config } from "@/common/config";

export function GET() {
    const content = `# Hey there, curious crawler!
# Welcome to Albert Devada — Cybersecurity & Backend Enthusiast Portfolio.
#
# Primary Focus & Platform Context:
# - Cybersecurity & Ethical Hacking: Penetration Testing, Bug Hunting, Vulnerability Assessment
# - Backend Engineering: Database Management, System Design, Architecture Design & Backend Development
# - Interactive Tools: CVE Tracker, CISA KEV Exploited Vulnerabilities, Email Data Leak, IP Geolocation, JSON Utilities
# - Knowledge Base: Security Writeups, Tech Insights & Development Blog
# - Free Public Tools: ${Config.WebUrl}/playground
#
# Live Portfolio: ${Config.WebUrl}
# GitHub: https://github.com/albert-devada
# LinkedIn: https://www.linkedin.com/in/albertdevada
# Instagram: https://www.instagram.com/albert_devada
#
# Free Public CVE Checker: ${Config.WebUrl}/playground?tab=cvedata
# Free Public CISA KEV: ${Config.WebUrl}/playground?tab=exploited
# Free Public Email Data Leak: ${Config.WebUrl}/playground?tab=breach
# Free Public Trading Markets: ${Config.WebUrl}/playground?tab=market
# Free Public Exchanges Markets: ${Config.WebUrl}/playground?tab=exchanges
#
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⣄⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⣀⠀⠀⢢⣤⣀⣦⣄⡀⠙⣶⡘⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⣀⣀⣨⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣯⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⢀⣽⣿⣿⣿⣿⠟⠛⠛⠛⠛⠻⢿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠘⣻⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣿⣿⣿⣿⢿⣷⡀⠀⠀⠀⠀⠀⠀
# ⠀⠀⣴⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣷⣽⣷⣄⠀⠀⠀⠀⠀
# ⠀⠀⠀⣾⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣯⠁⠀⠀⠀⠀
# ⠀⠀⠐⠛⢿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣷⣄⡀⠀⠀
# ⠀⠀⠀⠀⠘⠟⠿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⠇⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠟⠋⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣷⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
# ⠲⣶⣶⣦⠀⢀⣴⣶⣶⠖⠀⠀⠒⢶⣶⣶⣶⠀⠀⠐⢶⣶⣶⣦⠀⠀⠀⠒⢶⣶⣶⡆
# ⠀⣿⣿⣿⣠⣾⣿⡿⠋⠀⠀⠀⢠⣿⣿⣿⣿⣧⠀⠀⠠⣿⣿⣿⠀⠀⠀⠀⢸⣿⣿⡇
# ⠀⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⣾⣿⡿⠹⣿⣿⣇⠀⠐⣿⣿⣿⠀⠀⠀⠀⢸⣿⣿⡇
# ⠀⣿⣿⣿⠟⣿⣿⣿⣄⠀⠀⣼⣿⣿⣿⣶⣿⣿⣿⣆⢈⣿⣿⣿⣤⣤⣄⣀⣸⣿⣿⡇
# ⠀⣿⣿⡿⠀⠈⢿⣿⣿⡆⢸⣿⣿⠏⠉⠉⠉⢿⣿⡿⡄⣿⣿⣿⣿⢿⣿⡿⢸⣿⣿⡇
#
#
#
# SEO wizards & AI crawlers welcome — if you found this, you're looking at a cybersecurity enthusiast's portfolio.

# ---------------------------------------------------------------------------
# PUBLIC — Explicitly Allowed for Indexing & Exploration
# ---------------------------------------------------------------------------
User-agent: *
Allow: /
Allow: /project
Allow: /certificate
Allow: /blog
Allow: /playground
Allow: /chat
Allow: /assets/

Disallow: /*?*clid=
Disallow: /*?*_ga=
Disallow: /*?e=
Disallow: /*?j=
Disallow: /*?b=
Disallow: /*?m=
Disallow: /*?ref=*
Disallow: /*?utm_*
Disallow: /*?source=*
Disallow: /api/
Disallow: /cdn-cgi/

# ---------------------------------------------------------------------------
# LLM / AI ASSISTANTS — Welcome for Portfolio Citation & Generative Engine Optimization (GEO)
# ChatGPT, Claude, Perplexity, Gemini, DeepSeek, Apple, Meta, etc.
# ---------------------------------------------------------------------------
User-agent: AliyunBot
User-agent: AliyunCrawler
User-agent: AliyunSecBot
User-agent: AlibabaCloud
User-agent: Amazonbot
User-agent: anthropic-ai
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: BaichuanBot
User-agent: Baidu-YiYan
User-agent: BaiduAI
User-agent: BaiduApp
User-agent: BaiduSmartProgram
User-agent: Baiduspider
User-agent: Bingbot
User-agent: BingPreview
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Claude-web
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: CoHere-AI
User-agent: DeepSeek-Crawler
User-agent: DeepSeekBot
User-agent: DuckAssistBot
User-agent: DuckDuckBot
User-agent: ERNIE-Bot
User-agent: ERNIEBot
User-agent: FacebookBot
User-agent: Gemini-Fetch
User-agent: Google-Extended
User-agent: Google-NotebookLM
User-agent: Google-CloudVertexBot
User-agent: GoogleOther
User-agent: GoogleOther-Image
User-agent: GoogleOther-Video
User-agent: GPTBot
User-agent: ia-archiver
User-agent: iFlytekBot
User-agent: KimiBot
User-agent: Meta-ExternalAgent
User-agent: Meta-ExternalFetcher
User-agent: MiniMaxBot
User-agent: MistralAI-User
User-agent: MoonshotAI
User-agent: MoonshotBot
User-agent: OAI-SearchBot
User-agent: Perplexity-User
User-agent: PerplexityBot
User-agent: Qwen
User-agent: Sogou
User-agent: Sogou spider
User-agent: TencentTraveler
User-agent: TencentBot
User-agent: Twitterbot
User-agent: YouBot
User-agent: ZhipuBot

Allow: /
Allow: /project
Allow: /certificate
Allow: /blog
Allow: /playground
Allow: /chat

# ---------------------------------------------------------------------------
# AI TRAINING SCRAPERS — Aggressive Scraping (Blocked)
# ---------------------------------------------------------------------------
User-agent: CCBot
User-agent: Bytespider
User-agent: omgili
User-agent: omgilibot
User-agent: Diffbot
User-agent: MJ12bot
User-agent: DotBot
Disallow: /

# ---------------------------------------------------------------------------
# SEO AUDIT BOTS — Rate Limited
# ---------------------------------------------------------------------------
User-agent: SemrushBot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10

User-agent: DataForSeoBot
Crawl-delay: 10

# ---------------------------------------------------------------------------
# SITEMAP LOCATION
# ---------------------------------------------------------------------------
Sitemap: ${Config.WebUrl}/sitemap.xml
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
        },
    });
}
