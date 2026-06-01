-- ------------------------------------------------------------------------------
-- INDUSNET AI - POSTGRESQL DATABASE DDL SCHEMA
-- Execute these statements in the Supabase SQL Editor to initialize your database.
-- ------------------------------------------------------------------------------

-- 1. Create newsletter subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for rapid lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter(email);


-- 2. Create consultations booking table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(150),
    service VARCHAR(100) NOT NULL,
    booking_date VARCHAR(50), -- Scheduled slot details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consultations_email ON public.consultations(email);


-- 3. Create generic leads table (general inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(150),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Enable RLS (Row Level Security) if required, or configure public insert permissions.
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to perform insertions (Write-only Access)
CREATE POLICY "Allow public insert to newsletter" ON public.newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to consultations" ON public.consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
