-- 1. Job Positions Table
CREATE TABLE IF NOT EXISTS public.job_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_range VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 'active', 'draft', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Candidate Applications Table
CREATE TABLE IF NOT EXISTS public.candidate_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.job_positions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    current_company VARCHAR(255),
    current_designation VARCHAR(255),
    experience_years NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    expected_salary VARCHAR(100),
    notice_period VARCHAR(100),
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT NOT NULL,
    application_status VARCHAR(50) DEFAULT 'applied' NOT NULL, -- 'applied', 'review', 'interview', 'offered', 'rejected'
    ai_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Candidate AI Analysis Table
CREATE TABLE IF NOT EXISTS public.candidate_ai_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.candidate_applications(id) ON DELETE CASCADE,
    parsed_resume JSONB, -- skills, certifications, education, experience, projects
    skills JSONB, -- skills array
    strengths JSONB, -- strengths array
    weaknesses JSONB, -- weaknesses array
    job_match_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    summary TEXT,
    recommended_interview_questions JSONB, -- list of questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_candidate_applications_job_id ON public.candidate_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_candidate_ai_analysis_candidate_id ON public.candidate_ai_analysis(candidate_id);
