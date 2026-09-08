-- ============================================================
-- PAIMANA AI PLATFORM — COMPLETE SUPABASE SQL SCHEMA DDL
-- Paste this script directly into Supabase SQL Editor & Run
-- ============================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    project_code VARCHAR(100) PRIMARY KEY,
    project_name TEXT NOT NULL,
    sector VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    department VARCHAR(255),
    implementing_agency VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    original_cost DOUBLE PRECISION DEFAULT 0.0,
    revised_cost DOUBLE PRECISION DEFAULT 0.0,
    expenditure DOUBLE PRECISION DEFAULT 0.0,
    physical_progress DOUBLE PRECISION DEFAULT 0.0,
    sanction_date VARCHAR(50),
    original_doc VARCHAR(50),
    snapshot_date VARCHAR(50),
    target_final_delay_months DOUBLE PRECISION DEFAULT 0.0,
    target_cost_overrun_pct DOUBLE PRECISION DEFAULT 0.0,
    target_is_high_risk INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'UNDER_IMPLEMENTATION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Snapshots Table (Time-Series Progress)
CREATE TABLE IF NOT EXISTS public.project_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(100) REFERENCES public.projects(project_code) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    physical_progress DOUBLE PRECISION DEFAULT 0.0,
    financial_progress DOUBLE PRECISION DEFAULT 0.0,
    expenditure DOUBLE PRECISION DEFAULT 0.0,
    reported_cost DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_code, snapshot_date)
);

-- 4. ML Predictions & Attributions Table
CREATE TABLE IF NOT EXISTS public.ml_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(100) REFERENCES public.projects(project_code) ON DELETE CASCADE,
    model_version VARCHAR(100) NOT NULL,
    predicted_delay_months DOUBLE PRECISION,
    predicted_cost_overrun_cr DOUBLE PRECISION,
    predicted_cost_overrun_pct DOUBLE PRECISION,
    risk_score DOUBLE PRECISION,
    risk_tier VARCHAR(50),
    shap_drivers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Early Warning Notices & Governance Table
CREATE TABLE IF NOT EXISTS public.warnings (
    action_id VARCHAR(100) PRIMARY KEY,
    project_code VARCHAR(100) REFERENCES public.projects(project_code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    recipient TEXT NOT NULL,
    reason TEXT,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_HUMAN_APPROVAL',
    approved_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Logs Table (Full Traceability)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Documents & Vector Embeddings Table (pgvector RAG)
CREATE TABLE IF NOT EXISTS public.documents (
    id VARCHAR(100) PRIMARY KEY,
    project_code VARCHAR(100) REFERENCES public.projects(project_code) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_type VARCHAR(50) DEFAULT 'pdf',
    file_size BIGINT DEFAULT 0,
    processing_status VARCHAR(50) DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(100) REFERENCES public.documents(id) ON DELETE CASCADE,
    project_code VARCHAR(100),
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    page_number INT,
    section VARCHAR(255),
    embedding VECTOR(384), -- Dimension for all-MiniLM-L6-v2 embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Grant Table & Schema Privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 9. Enable Row Level Security & Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to authenticated/service role" ON public.projects;
DROP POLICY IF EXISTS "Allow all access to authenticated/service role" ON public.warnings;
DROP POLICY IF EXISTS "Allow all access to authenticated/service role" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow all access to authenticated/service role" ON public.documents;
DROP POLICY IF EXISTS "Allow all access to authenticated/service role" ON public.document_chunks;

CREATE POLICY "Allow all access to authenticated/service role" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated/service role" ON public.warnings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated/service role" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated/service role" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to authenticated/service role" ON public.document_chunks FOR ALL USING (true) WITH CHECK (true);

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_sector ON public.projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_state ON public.projects(state);
CREATE INDEX IF NOT EXISTS idx_warnings_project ON public.warnings(project_code);
CREATE INDEX IF NOT EXISTS idx_warnings_status ON public.warnings(status);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_proj ON public.document_chunks(project_code);
