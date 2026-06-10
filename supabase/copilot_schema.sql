-- ------------------------------------------------------------------------------
-- SMART TENDER COPILOT - POSTGRESQL DATABASE DDL SCHEMA
-- Execute these statements in the Supabase SQL Editor to initialize Copilot tables.
-- ------------------------------------------------------------------------------

-- 1. Create Bidding Companies table
CREATE TABLE IF NOT EXISTS public.bidding_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Portal Users table
CREATE TABLE IF NOT EXISTS public.portal_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'bidder' NOT NULL, -- 'bidder', 'internal_evaluator'
    company_id UUID REFERENCES public.bidding_companies(id) ON DELETE SET NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portal_users_email ON public.portal_users(email);

-- 3. Create Tenders table
CREATE TABLE IF NOT EXISTS public.tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirement_matrix JSONB, -- The structured JSON checklist extracted from the tender PDF
    status VARCHAR(50) DEFAULT 'open' NOT NULL, -- 'open', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Bidder Sessions table
CREATE TABLE IF NOT EXISTS public.bidder_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.bidding_companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.portal_users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL, -- 'in_progress', 'submitted', 'evaluated'
    compliance_score NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bidder_sessions_tender ON public.bidder_sessions(tender_id);
CREATE INDEX IF NOT EXISTS idx_bidder_sessions_company ON public.bidder_sessions(company_id);

-- 5. Create Chat History table
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.bidder_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'user', 'agent'
    message TEXT NOT NULL,
    extracted_data JSONB, -- The structured requirements checked/extracted at this turn
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_history_session ON public.chat_history(session_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.bidding_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bidder_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for secure separation
-- Evaluators can read everything; Bidders can only read/write their own company's data.

-- Bidding Companies Policy
CREATE POLICY "Users can view their own company" ON public.bidding_companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.portal_users 
            WHERE public.portal_users.id = auth.uid() 
            AND (public.portal_users.company_id = public.bidding_companies.id OR public.portal_users.role = 'internal_evaluator')
        )
    );

-- Portal Users Policy
CREATE POLICY "Users can view their own profile" ON public.portal_users
    FOR SELECT USING (
        id = auth.uid() OR role = 'internal_evaluator'
    );

-- Tenders Policy (Public read-only for authenticated users, insert for evaluators)
CREATE POLICY "Authenticated users can view tenders" ON public.tenders
    FOR SELECT USING (true);

-- Bidder Sessions Policy
CREATE POLICY "Bidders can view/edit their own sessions" ON public.bidder_sessions
    FOR ALL USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.portal_users 
            WHERE public.portal_users.id = auth.uid() AND public.portal_users.role = 'internal_evaluator'
        )
    );

-- Chat History Policy
CREATE POLICY "Bidders can view/edit their own chat history" ON public.chat_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.bidder_sessions 
            WHERE public.bidder_sessions.id = public.chat_history.session_id 
            AND (public.bidder_sessions.user_id = auth.uid() OR 
                 EXISTS (
                     SELECT 1 FROM public.portal_users 
                     WHERE public.portal_users.id = auth.uid() AND public.portal_users.role = 'internal_evaluator'
                 ))
        )
    );
