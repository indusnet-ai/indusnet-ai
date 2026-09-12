-- Copilot & Smart Tender Database DDL Schema (PostgreSQL / Supabase)

-- 1. Bidding Companies
CREATE TABLE IF NOT EXISTS public.bidding_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Portal Users
CREATE TABLE IF NOT EXISTS public.portal_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'bidder', 'internal_evaluator', 'hr_manager'
    company_id UUID REFERENCES public.bidding_companies(id) ON DELETE SET NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tenders
CREATE TABLE IF NOT EXISTS public.tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirement_matrix JSONB,
    status VARCHAR(50) DEFAULT 'open' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bidder Sessions
CREATE TABLE IF NOT EXISTS public.bidder_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.bidding_companies(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.portal_users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL, -- 'in_progress', 'submitted', 'evaluated'
    compliance_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration for existing databases:
-- ALTER TABLE public.bidder_sessions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE NULL;

-- 5. Chat History
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.bidder_sessions(id) ON DELETE CASCADE NOT NULL,
    sender VARCHAR(50) NOT NULL, -- 'user', 'agent'
    message TEXT NOT NULL,
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Job Positions
CREATE TABLE IF NOT EXISTS public.job_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    benefits TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Candidate Applications
CREATE TABLE IF NOT EXISTS public.candidate_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.job_positions(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    current_company VARCHAR(255),
    current_designation VARCHAR(255),
    experience_years NUMERIC(4, 1) NOT NULL,
    expected_salary VARCHAR(100),
    notice_period VARCHAR(100),
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT NOT NULL,
    application_status VARCHAR(50) DEFAULT 'applied' NOT NULL,
    ai_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Candidate AI Analysis
CREATE TABLE IF NOT EXISTS public.candidate_ai_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidate_applications(id) ON DELETE CASCADE NOT NULL UNIQUE,
    parsed_resume JSONB,
    skills JSONB,
    strengths JSONB,
    weaknesses JSONB,
    job_match_score NUMERIC(5, 2),
    summary TEXT,
    recommended_interview_questions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Candidate Offers
CREATE TABLE IF NOT EXISTS public.candidate_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidate_applications(id) ON DELETE CASCADE NOT NULL UNIQUE,
    offer_letter_text TEXT NOT NULL,
    annual_ctc VARCHAR(100),
    variable_pay VARCHAR(100),
    candidate_address TEXT,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
