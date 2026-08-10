# 🚀 Portofolio Version 1.0

<p align="center">
  <b>Portofolio Interaktif & Platform Utility Cyber Security Modern</b><br/>
  Dikembangkan menggunakan Next.js 16, React 19, Tailwind CSS v4, dan TypeScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</p>

---

## 📌 Tentang Proyek

**Portofolio Version 1.0** adalah web portofolio interaktif generasi baru yang dirancang khusus untuk memamerkan karya, sertifikasi, serta keahlian di bidang **Cybersecurity** dan **Backend Development**.

Bukan sekadar portofolio statis biasa, proyek ini menghadirkan pengalaman pengguna (_User Experience_) yang imersif melalui **Simulator Terminal Linux interaktif**, **Rangkaian Tools Keamanan Siber (Security Tools)**, **Widget Musik**, serta **Dukungan Multi-Bahasa** (Indonesia & Inggris).

---

## ✨ Fitur-Fitur Utama

- 💻 **Linux Terminal Emulator**: Terminal interaktif di dalam browser yang mendukung berbagai perintah custom seperti `whoami`, `neofetch`, `ifconfig`, `credentials`, `experience`, `contact`, `help`, dan `ls`.
- 🛠️ **Dev & Cyber Security Tools Suite**:
    - **Breach Checker**: Memeriksa kebocoran data (_data breach_).
    - **CVE Tracker**: Pelacak kerentanan keamanan siber terbaru.
    - **Known Exploited Vulnerabilities (CISA)**: Monitoring kerentanan yang sedang dieksploitasi di dunia nyata.
    - **Encoder & Decoder**: Alat konversi format teks (Base64, URL, dll.).
    - **IP Geolocation**: Informasi lokasi dan detail alamat IP.
    - **JSON Formatter & Validator**: Perapi dan penguji struktur data JSON.
    - **Server Status Monitor**: Pemantau status koneksi dan server.
    - **Exchange Rate & Market Watch**: Pemantau kurs mata uang dan pasar.
- 🌐 **Multi-Bahasa (i18n)**: Dukungan beralih bahasa antara Bahasa Indonesia dan Bahasa Inggris secara responsif.
- 🌙 **Theme Switcher**: Fitur Dark Mode dan Light Mode dengan latar belakang bernuansa dinamis.
- 🎵 **Music Player Widget**: Widget pemutar musik interaktif terintegrasi.
- 📱 **Desain Fully Responsive**: Tampilan responsif dengan Mobile Dock Navigasi untuk akses nyaman di perangkat ponsel maupun desktop.
- 🛡️ **Keamanan Terintegrasi**: Dilengkapi dengan Cloudflare Turnstile CAPTCHA untuk perlindungan formulir dan API.

---

## 🛠️ Teknologi yang Digunakan

### **Core & Framework**

- **[Next.js 16.2.9](https://nextjs.org/)** (App Router Architecture)
- **[React 19.2.4](https://react.dev/)**
- **[TypeScript 5](https://www.typescriptlang.org/)**

### **Styling & UI Components**

- **[Tailwind CSS v4](https://tailwindcss.com/)** – Framework CSS modern utilitas utama.
- **[Radix UI / Base UI](https://www.radix-ui.com/)** – Komponen UI headless yang aksesibel (Accordion, Tabs, Avatar, Icons).
- **[Framer Motion](https://www.framer.com/motion/)** – Library animasi smooth dan interaktif.
- **[Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)** – Kumpulan ikon grafis modern.
- **[Sonner](https://sonner.emilkowal.si/)** – Sistem notifikasi toast yang elegan.
- **[Next Themes](https://github.com/pacocoursey/next-themes)** – Manajemen tema gelap dan terang.

### **Backend, Data & Security**

- **[Supabase](https://supabase.com/)** (`@supabase/supabase-js`) – Platform backend & database cloud.
- **[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** (`@marsidev/react-turnstile`) – Proteksi bot & keamanan form.
- **[Highlight.js](https://highlightjs.org/) & [React Markdown](https://github.com/remarkjs/react-markdown)** – Render dan syntax highlighting dokumen markdown/blog.
- **[UA Parser JS](https://faisalman.github.io/ua-parser-js/)** – Deteksi user agent dan browser pengguna.

---

## 📁 Struktur Folder Proyek

Berikut adalah gambaran ringkas struktur direktori proyek agar mudah dipahami:

```text
portofolio-v1/
├── public/                 # Asset statis publik (gambar, ikon, logo, favicon)
├── src/                    # Source code utama aplikasi
│   ├── app/                # Next.js App Router (Routing Halaman & REST API)
│   │   ├── api/            # API Route handlers (Backend endpoints & Turnstile validation)
│   │   ├── blog/           # Halaman artikel & blog siber
│   │   ├── certificate/    # Halaman galeri sertifikasi & lisensi
│   │   ├── chat/           # Halaman fitur chat interaktif
│   │   ├── playground/     # Halaman area uji coba & eksperimen
│   │   ├── project/        # Halaman katalog & portofolio proyek
│   │   ├── globals.css     # Styling global Tailwind v4 & variabel warna
│   │   ├── layout.tsx      # Root Layout utama aplikasi
│   │   └── page.tsx        # Landing page / Halaman Utama
│   ├── common/             # Modul umum & shared logic
│   │   ├── constants/      # Data statis (Profil Author, Metadata, Exchange Data)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── linux/          # Perintah & Logika Emulator Terminal Linux
│   │   ├── service/        # Integrasi API Services & Fetcher
│   │   ├── supabase/       # Klien integrasi database Supabase
│   │   └── types/          # Definisi Tipe TypeScript
│   ├── components/         # Komponen UI Reusable (Button, Cards, Timeline, Modal, Animasi)
│   ├── language/           # Sistem Manajemen Multi-Bahasa (Provider & Translator ID/EN)
│   ├── lib/                # Helper utilities, fungsi format, dan konfigurasi umum
│   ├── navigation/         # Komponen Navigasi (Desktop Navigation & Mobile Dock)
│   ├── partial/            # Komponen Tata Letak Parsial (Header, Footer, Profile Card, MacWindow)
│   ├── theme/              # Manajemen Tema (Dark/Light Mode & Background Animasi)
│   ├── tools/              # Komponen Rangkaian Tools Keamanan Siber & Dev Tools
│   └── widget/             # Widget Interaktif (Terminal, Experience, Music Player, Market)
├── docker-compose.yml      # Konfigurasi containerization Docker
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Manifes dependensi & script proyek
├── tsconfig.json           # Konfigurasi compiler TypeScript
└── README.md               # Dokumentasi utama proyek
```

---

## 🚀 Cara Menjalankan Proyek

### **Prasyarat**

- [Node.js](https://nodejs.org/) (Versi 18 / 20 / 22 disarankan)
- Package Manager: `npm`, `yarn`, `pnpm`, atau `bun`
- [Docker](https://www.docker.com/) _(Opsional jika ingin menjalankan via container)_

---

### **Langkah Instalasi (Lokal)**

1. **Clone Repository**

    ```bash
    git clone https://github.com/albert-devada/portofolio-v1.git
    cd portofolio-v1
    ```

2. **Instal Dependensi**

    ```bash
    npm install
    ```

3. **Konfigurasi Environment Variable**
   Buat file `.env` di direktori utama (_root_) dan tambahkan kredensial yang diperlukan (seperti Supabase URL & Key, Turnstile Secret, dll.):

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Variabel environment lainnya...
    ```

4. **Jalankan Development Server**

    ```bash
    npm run dev
    ```

5. **Buka di Browser**
   Buka alamat [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

### **Menjalankan dengan Docker**

Jika Anda menggunakan Docker & Docker Compose:

```bash
docker-compose up --build
```

Aplikasi akan otomatis terkompilasi dan dapat diakses di `http://localhost:3000`.

---

## 📜 Script npm yang Tersedia

- `npm run dev` : Menjalankan server pengembangan (_development mode_).
- `npm run build` : Membuat bundle produksi (_production build_).
- `npm run start` : Menjalankan server produksi hasil kompilasi.
- `npm run lint` : Menjalankan pengecekan linter kode dengan ESLint.

---

## 👨‍💻 Pengembang

- **Nama**: Naufal Burhanuddin Yusuf (Albert Devada)
- **Fokus**: Cybersecurity Enthusiast & Backend Enthusiast
- **GitHub**: [@albert-devada](https://github.com/albert-devada)
- **LinkedIn**: [Naufal Burhanuddin Yusuf](https://www.linkedin.com/in/albertdevada)

---

<p align="center">
  Made with ❤️ by <b>Albert Devada</b>
</p>
