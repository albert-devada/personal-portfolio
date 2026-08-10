-- 1. TABEL PERSONAL
CREATE TABLE personal (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    photo_url TEXT,
    title VARCHAR(225)[] NOT NULL,
    description_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    skills TEXT[],
    portfolio_url TEXT,
    location VARCHAR(100) NOT NULL,
    activity VARCHAR(150) NOT NULL,
    status_work BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL EDUCATION
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    institution_en VARCHAR(100) NOT NULL,
    institution_id VARCHAR(100) NOT NULL,
    major_en VARCHAR(100) NOT NULL,
    major_id VARCHAR(100) NOT NULL,
    status_en VARCHAR(50) NOT NULL,
    status_id VARCHAR(50) NOT NULL,
    period DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL CERTIFICATE
CREATE TABLE certificate (
    id SERIAL PRIMARY KEY,
    logo_url TEXT,
    title VARCHAR(150) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    href_url TEXT,
    issued DATE NOT NULL,
    credential VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL EXPERIENCE
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    logo_url TEXT,
    title VARCHAR(150) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    released DATE NOT NULL,
    description_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL WORKING
CREATE TABLE working (
    id SERIAL PRIMARY KEY,
    location_en VARCHAR(100) NOT NULL,
    location_id VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    title_id VARCHAR(100) NOT NULL,
    logo_url TEXT,
    href_url TEXT,
    start_date VARCHAR(30) NOT NULL,
    end_date VARCHAR(30) NOT NULL,
    description_en TEXT NOT NULL,
    description_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL BLOG
CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_id VARCHAR(200) NOT NULL,
    summary_en VARCHAR(300) NOT NULL,
    summary_id VARCHAR(300) NOT NULL,
    markdown_en TEXT NOT NULL,
    markdown_id TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- HARDENING SECURITY: ROW LEVEL SECURITY (RLS) & POLICIES
-- =========================================================================
ALTER TABLE personal ENABLE ROW LEVEL SECURITY;

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

ALTER TABLE certificate ENABLE ROW LEVEL SECURITY;

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

ALTER TABLE working ENABLE ROW LEVEL SECURITY;

ALTER TABLE blog ENABLE ROW LEVEL SECURITY;

-- Policy Akses Baca Murni Untuk Publik (Tamu Biasa & Anon-Authenticated)
CREATE POLICY "Allow public anon select" ON personal FOR
SELECT USING (true);

CREATE POLICY "Allow public anon select" ON education FOR
SELECT USING (true);

CREATE POLICY "Allow public anon select" ON certificate FOR
SELECT USING (true);

CREATE POLICY "Allow public anon select" ON experience FOR
SELECT USING (true);

CREATE POLICY "Allow public anon select" ON working FOR
SELECT USING (true);

CREATE POLICY "Allow public anon select" ON blog FOR
SELECT USING (true);

-- =========================================================================
-- FIX ACCESS: TABLE PRIVILEGES FOR ANON ROLE
-- =========================================================================
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT ON public.personal TO anon;

GRANT SELECT ON public.education TO anon;

GRANT SELECT ON public.certificate TO anon;

GRANT SELECT ON public.experience TO anon;

GRANT SELECT ON public.working TO anon;

GRANT SELECT ON public.blog TO anon;