<p align="center">
  <img src="public/cover.gif" alt="Cover Banner" width="100%"/>
  <b>Modern Interactive Portfolio & Cybersecurity Utility Platform</b><br />
  <sub>Modern portfolio website built using Next.js 16, React 19, Tailwind CSS v4, and TypeScript.</sub>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</p>

# 📝 Portfolio Overview

**Portfolio Version 1.0** is a modern, interactive web portfolio showcasing my work as a software engineer. Built with modern web technologies, it goes beyond a traditional portfolio with features such as an **interactive Linux Terminal Simulator**, **Cybersecurity Tools**, **Music Widget**, and **Indonesian & English language support** for a more engaging experience.

**Live Website:** [Albert Devada](https://albertdevada.me)

## ✨ Key Features

- 💻 **Linux Terminal Emulator**: Interactive terminal with various custom commands.
- 🛠️ **Cybersecurity & Utility Tools**: Tools for security, analysis, and utilities.
    - **Breach Checker**: Checks for potential data breaches.
    - **CVE Tracker**: Tracks the latest security vulnerabilities.
    - **CISA KEV**: Monitors vulnerabilities known to be exploited.
    - **Encoder & Decoder**: Encodes and decodes various text formats.
    - **IP Geolocation**: Provides IP address location and information.
    - **JSON Formatter & Validator**: Formats and validates JSON data.
    - **Server Status Monitor**: Monitors server status and connectivity.
    - **Exchange Rate & Market Watch**: Tracks exchange rates and market conditions.
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
- **[Lucide React](https://lucide.dev/)** **&** **[React Icons](https://react-icons.github.io/react-icons/)** – Modern icon libraries.
- **[Sonner](https://sonner.emilkowal.si/)** – Elegant toast notification system.
- **[Magic UI](https://magicui.design/)** – Beautiful animated components.
- **[Next Themes](https://github.com/pacocoursey/next-themes)** – Dark and light theme management.

### Backend & Infrastructure

- **[Supabase](https://supabase.com/)** – Cloud backend and database platform.
- **[UA Parser JS](https://faisalman.github.io/ua-parser-js/)** – User agent and browser detection.
- **[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** – Bot protection and form security.

### Testing & Automation

- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing

## 📁 Project Structure

```text
personal-portfolio/
├── .github/                # GitHub Actions CI/CD workflows
├── e2e/                    # Playwright End-to-End tests
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Route handlers & JSON endpoints
│   │   ├── blog/           # Blog posts & articles
│   │   ├── certificate/    # Certificates & licenses
│   │   ├── chat/           # Interactive chat feature (Soon!)
│   │   ├── playground/     # Interactive playground & tools
│   │   ├── project/        # Project catalog & portfolio
│   │   ├── globals.css     # Global styling
│   │   ├── layout.tsx      # Root Layout
│   │   └── page.tsx        # Landing page
│   ├── common/             # Common modules & shared logic
│   │   ├── constants/      # Static data
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── linux/          # Terminal Emulator Logic
│   │   ├── service/        # API Services & Fetchers
│   │   ├── supabase/       # Supabase Integration
│   │   └── types/          # TypeScript Definitions
│   ├── components/         # Reusable UI Components
│   ├── language/           # Multi-Language Management
│   ├── lib/                # Helper utilities & Rate Limiting
│   ├── navigation/         # Navigation Components
│   ├── partial/            # Partial Layout Components
│   ├── proxy.ts            # Subdomain Proxy & Rate Limit
│   ├── theme/              # Theme Management (Dark/Light Mode)
│   ├── tools/              # Cyber Security & Dev Tools Components
│   └── widget/             # Widgets (Terminal, Experience, Music Player, Market)
├── docker-compose.yml      # Docker containerization configuration
├── jest.config.ts          # Jest test configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
├── playwright.config.ts    # Playwright E2E test configuration
├── tsconfig.json           # TypeScript compiler configuration
├── vercel.json             # Vercel cron job configuration
└── README.md               # Main project documentation
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
APP_DOMAIN="https://your_app_domain.com"
APP_KEY="your-secret-app-key-here"

# DATABASE SUPABASE
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_key"

# CLOUDFLARE TURNSTILE
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your_turnstile_site_key"
TURNSTILE_SECRET_KEY="your_turnstile_secret_key"
```

> **Note on Environment Variables & APIs:**
> Refer to [`.env.example`](./.env.example) for the full list of configurable environment variables.
>
> - **Core Configuration:** Supabase database, Cloudflare Turnstile, and `APP_DOMAIN`.
> - **Subdomain API:** Requires `api.domain` DNS record (e.g., `https://api.albertdevada.me`) for production API routing.
> - **Optional Features:** Geolocation Lookup, Playground CVE & Breach tools, Financial & Market News APIs.

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

- **Unit Tests** - Testing utility functions (`src/lib/__tests__/`)
- **Component Tests** - Testing React UI components (`src/components/__tests__/`)
- **Tools Tests** - Testing Cybersecurity & Dev Tools (`src/tools/__tests__/`)
- **E2E Tests** - End-to-end browser testing (`e2e/`)

### Test Coverage

- ✅ Utility functions (cn helper)
- ✅ UI components (Button, etc.)
- ✅ Layout components
- ✅ Page navigation and routing
- ✅ Theme switching functionality

For detailed testing documentation, see [**tests**/README.md](./__tests__/README.md).

## 📦 Production

```bash
npm run build
npm run start
```

## 👨‍💻 Author

**Albert Devada**

- [Instagram](https://www.instagram.com/albert_devada)
- [LinkedIn](https://www.linkedin.com/in/albertdevada)

### 🙏 Acknowledgments

Special thanks to the amazing tools and platforms that made this project possible:

- [Next.js](https://nextjs.org/) - The React framework that powers everything
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Vercel](https://vercel.com/) - Seamless deployment and hosting
- [Supabase](https://supabase.com/) - Powerful backend infrastructure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <b>© Created by Albert Devada. Built with 💻 and ☕. All rights reserved.</b>
</p>
