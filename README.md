<p align="center">
  <img src="public/cover.gif" alt="Cover Banner" width="100%"/>
  <b>Modern Interactive Portfolio & Vulnerability Tracking Platform</b><br />
  <sub>Built with Next.js 16, React 19, Tailwind CSS v4, and TypeScript.</sub>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI%20Assistant-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
</p>

# 📝 Portfolio Overview

**Portfolio Version 1.2** is an interactive web portfolio showcasing my work as a software engineer. Built with modern web technologies, it goes beyond a traditional portfolio by featuring an **Interactive Linux Terminal**, an **AI Assistant**, **vulnerability tracking & market conditions**, and **Indonesian & English language support**.

**Live Website:** [Albert Devada](https://albertdevada.me)

## ✨ Key Features

- 💻 **Interactive Linux Terminal**: Browser-based terminal with custom shell commands.
- 🤖 **AI Assistant**: Conversational assistant powered by Google Gemini.
- 🛠️ **CVE Vulnerabilities & Market Conditions**: Tools for security, analysis, and track CVE.
    - **IP Geolocation**: Provides IP address location and information.
    - **Server Status Monitor**: Monitors server health and connectivity.
    - **CVE & CISA KEV**: Actively exploited vulnerabilities and latest vulnerability issues.
    - **Breach Checker**: Checking for potential data leaks.
    - **Exchange Rate & Market Watch**: Monitor current exchange rates and market conditions.
- 🌐 **Multi-Language**: Supports Indonesian and English.
- 🌙 **Theme Switcher**: Dark Mode and Light Mode.
- 🎵 **Music Player**: Interactive music player widget.
- 📱 **Fully Responsive**: Optimized for desktop and mobile devices.
- 🛡️ **Security**: Form and API protection with Cloudflare Turnstile.

## ⚙️ Technology Stack

Modern technologies and development tools powering the features, interface, and infrastructure behind this interactive portfolio.

### Core & Framework

- **[Next.js 16.2.9](https://nextjs.org/)** - Architecture React Framework
- **[React 19.2.4](https://react.dev/)** - Latest React
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI Components

- **[Tailwind CSS v4.0](https://tailwindcss.com/)** – Modern utility-first CSS framework.
- **[Radix UI / Base UI](https://www.radix-ui.com/)** – Accessible headless UI components.
- **[Framer Motion](https://www.framer.com/motion/)** – Smooth and interactive animation library.
- **[Lenis](https://lenis.darkroom.engineering/)** – Smooth and performant scrolling experience.
- **[Lucide React](https://lucide.dev/)** **&** **[React Icons](https://react-icons.github.io/react-icons/)** – Modern icon libraries.
- **[Sonner](https://sonner.emilkowal.si/)** – Elegant toast notification system.
- **[Magic UI](https://magicui.design/)** – Beautiful animated components.
- **[Next Themes](https://github.com/pacocoursey/next-themes)** – Dark and light theme management.

### Content & Markdown Processing

- **[React Markdown](https://github.com/remarkjs/react-markdown)** – Dynamic Markdown renderer for technical articles.
- **[Remark GFM](https://github.com/remarkjs/remark-gfm)** – GitHub Flavored Markdown plugin support (tables, autolinks).
- **[Highlight.js](https://highlightjs.org/)** **&** **[Rehype Highlight](https://github.com/rehypejs/rehype-highlight)** – Code syntax highlighting for technical blog posts.

### Backend & Infrastructure

- **[Google Gemini AI](https://ai.google.dev/)** – LLM-powered interactive conversational AI assistant.
- **[Supabase](https://supabase.com/)** – Cloud backend and database platform.
- **[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** – Bot protection and form security.
- **[UA Parser JS](https://faisalman.github.io/ua-parser-js/)** – User agent and browser telemetry detection.
- **[Vercel Analytics & Speed Insights](https://vercel.com/analytics)** – Web traffic analytics and Core Web Vitals monitoring.
- **[NIST NVD & CISA KEV](https://nvd.nist.gov/)** – Real-time CVE vulnerability and exploit feeds.
- **[Frankfurter API](https://frankfurter.dev/)** – Real-time currency exchange rate data.

### Testing & Automation

- **[Jest](https://jestjs.io/)** – JavaScript and TypeScript unit testing framework.
- **[React Testing Library](https://testing-library.com/)** – Component testing with DOM assertions.
- **[Playwright](https://playwright.dev/)** – Cross-browser end-to-end (E2E) testing suite.
- **[ESLint](https://eslint.org/)** – Code quality and static analysis linter.
- **[GitHub Actions](https://github.com/features/actions)** – Automated CI/CD pipeline for automated testing and builds.

## 📁 Project Structure

```text
personal-portfolio/
├── .github/                # GitHub Actions CI/CD workflows
├── database/               # PostgreSQL schema & database setup
├── e2e/                    # Playwright End-to-End browser tests
├── public/                 # Static assets, icons, manifest, and avatars
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Route groups (Home, Certificate, Experience, Tech Blog, AI Assistant & Playground)
│   │   ├── api/            # Open-source API Route handlers (CVE Data, Search Vulnerability, Market & Exchange)
│   │   ├── globals.css     # Global styles & Tailwind configuration
│   │   ├── layout.tsx      # Root Layout with Font & Analytics
│   │   └── not-found.tsx   # Custom 404 handler
│   ├── common/             # Common modules & shared application logic
│   │   ├── config/         # App metadata, author info, and configuration
│   │   ├── constants/      # Static data, menus, profiles, and playground constants
│   │   ├── hooks/          # Custom React Hooks (breakpoints, intro, terminal)
│   │   ├── music/          # Music player engine & playlist data
│   │   ├── service/        # API services, fetchers, and validators
│   │   └── types/          # TypeScript definitions & data models
│   ├── components/         # Reusable UI & Components
│   │   ├── base/           # Base UI primitives (button, badge, card, tabs, etc.)
│   │   ├── linux/          # Interactive Linux terminal simulator & commands
│   │   ├── navigation/     # Header, sidebar, mobile dock, navigation menus
│   │   ├── playground/     # Interactive security & utility tool tabs
│   │   ├── transition/     # Animation & transition wrappers (blur fade)
│   │   └── ui/             # High-level UI widgets, music player, macOS window
│   ├── contents/           # Page content templates & interactive views
│   ├── function/           # Pure helper functions & transformers
│   ├── handlers/           # Feature-specific event & AI assistant handlers
│   ├── language/           # Multi-language provider & translation system
│   ├── lib/                # Library test suites
│   ├── proxy.ts            # Subdomain API proxy & rate limiting middleware
│   ├── supabase/           # Supabase client, server, and auth helpers
│   ├── theme/              # Theme provider (Dark/Light mode & typography)
│   ├── tools/              # Specialized tools test suites
│   └── utils/              # Encryption, date formatting, and rate limiters
├── docker-compose.yml      # Docker containerization configuration
├── jest.config.mjs         # Jest testing configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
├── playwright.config.ts    # Playwright E2E test configuration
├── tsconfig.json           # TypeScript compiler configuration
├── vercel.json             # Vercel configuration & System Health (PING)
└── README.md               # Portfolio Project Documentation
```

## 🗄️ Database Schema

This project uses **Supabase PostgreSQL** with Row Level Security (RLS). Multi-language content is stored using **`_en`** (English) and **`_id`** (Indonesian) column suffixes.

### Main Tables

- **`personal`** — Bio (`description_en`, `description_id`), skills, and work status.
- **`education`** — Academic history, institutions, and majors (`_en` & `_id`).
- **`certificate`** — Certifications, vendors, issue dates, and credential links.
- **`experience`** — Projects with localized descriptions (`_en` & `_id`) and JSON links.
- **`working`** — Work history, titles, locations, and descriptions (`_en` & `_id`).
- **`blog`** — Articles with localized titles, summaries, and Markdown content (`_en` & `_id`).

👉 **Complete SQL Setup**: The full script (tables, RLS policies, and permissions) is available in [**`database/schema.sql`**](./database/schema.sql). Copy and run it directly in your Supabase SQL Editor!

## 🚀 Installation

Follow the steps below to set up the project locally and get the portfolio running in your development environment.

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Supabase account (for database)

### Environment Variables

Create a `.env` file in the root directory:

```env
# APPLICATION CONFIGURATION
NEXT_PUBLIC_APP_NAME="your-secret-app-key-here"
NEXT_PUBLIC_WEB_URL="https://your_app_domain.com"
NEXT_PUBLIC_API_URL="https://your_subdomain.com"

# GEMINI AI CONFIGURATION
GEMINI_API_KEY="your_gemini_key"

# SUPABASE DATABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_key"

# CLOUDFLARE TURNSTILE CONFIGURATION
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your_turnstile_site_key"
TURNSTILE_SECRET_KEY="your_turnstile_secret_key"
```

> **Note on Configuration:**
> Refer to [`.env.example`](./.env.example) for all variables.
>
> - **Built-in APIs:** All core feeds are open-sourced directly inside [`src/app/api/`](./src/app/api/).
> - **Required Setup:** Only credentials (Supabase, Turnstile, Gemini) and `GEOLOCATION_API_URL` need configuration in `.env`.

Add or remove environment variables according to the services enabled in your local configuration.

### Setup Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/albert-devada/personal-portfolio.git
    cd personal-portfolio
    ```

2. **Install dependencies**

    ```bash
    #using npm
    npm install
    #using bun
    bun install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your values
    ```

4. **Run database migrations** (if applicable)

    ```bash
    # Follow Supabase documentation for migrations
    ```

5. **Start development server**

    ```bash
    #using npm
    npm run dev
    #using bun
    bun dev
    ```

6. **Open browser**
    ```
    http://localhost:3000
    ```

### Docker Compose

The project also includes Docker Compose configuration for containerized development and deployment.

1. **Build and start the application**
    ```bash
    docker compose up --build
    ```
2. **Run the containers in the background**
    ```bash
    docker compose up -d
    ```
3. **Stop the containers**
    ```bash
    docker compose down
    ```
4. **Stop and remove the containers**
    ```bash
    docker compose down -v
    ```

## 🧪 Testing Execution & Coverage

### Test Structure

- **Unit Tests** - Utility & helper functions ([`src/lib/__tests__/`](./src/lib/__tests__/))
- **Component Tests** - Reusable UI components ([`src/components/__tests__/`](./src/components/__tests__/))
- **Tools Tests** - Interactive security & utility tools ([`src/tools/__tests__/`](./src/tools/__tests__/))
- **E2E Tests** - Full browser end-to-end testing ([`e2e/`](./e2e/))

### Test Coverage & CI/CD Pipeline

- ✅ **Unit & Component Testing ([Jest](./jest.config.mjs))**: 4 test suites, 17 tests passed (100% PASS)
- ✅ **Code Quality & Linting ([ESLint](./eslint.config.mjs))**: Zero errors, zero warnings
- ✅ **Production Build ([Next.js Turbopack](./next.config.ts))**: 20 routes + Proxy middleware compiled successfully
- ✅ **Cross-Browser E2E ([Playwright](./playwright.config.ts))**: Automated in CI via GitHub Actions ([`playwright.yml`](./.github/workflows/playwright.yml))
- ✅ **Verified Features**: Terminal simulator, theme switching, multi-language context, security tools, and layout rendering

For detailed testing documentation, see [**tests**/README.md](./__tests__/README.md).

## 📦 Production

```bash
npm run build
npm run start
```

## 👨‍💻 Author

**Albert Devada**

- [Website](https://albertdevada.me)
- [LinkedIn](https://www.linkedin.com/in/albertdevada)
- [Instagram](https://www.instagram.com/albert_devada)

### 🙏 Acknowledgments

Special thanks to the amazing tools and platforms that made this project possible:

- [Next.js](https://nextjs.org/) - The React framework that powers everything
- [Tailwind CSS](https://tailwindcss.com/) - Modern styling and utility-first design
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Google Gemini](https://ai.google.dev/) - AI intelligence powering the conversational assistant
- [Supabase](https://supabase.com/) - Powerful backend infrastructure
- [Vercel](https://vercel.com/) - Seamless deployment and hosting

## 📄 License

This project is licensed under the Non-Commercial Attribution License - see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <b>© Created by Albert Devada. Built with 💻 and ☕. All rights reserved.</b>
</p>
