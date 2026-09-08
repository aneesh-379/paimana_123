-- ============================================================
-- PAIMANA AI PLATFORM — SUPABASE POSTGRESQL & VECTOR SCHEMA
-- SIH Problem Statement 103
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------
-- 1. USERS TABLE (Phase 11)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ANALYST', 'OFFICER', 'VIEWER')),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. PROJECTS TABLE (Phase 12)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(100) UNIQUE NOT NULL,
    project_name VARCHAR(500) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    implementing_agency VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    original_cost NUMERIC(15, 2) NOT NULL,
    revised_cost NUMERIC(15, 2) NOT NULL,
    original_completion_date DATE,
    revised_completion_date DATE,
    actual_completion_date DATE,
    status VARCHAR(50) DEFAULT 'UNDER_IMPLEMENTATION',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. DATASETS REGISTRY & IMPORT JOBS (Phase 18, 19)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_name VARCHAR(255) NOT NULL,
    source VARCHAR(255) DEFAULT 'MoSPI / PAIMANA',
    reporting_period VARCHAR(100),
    file_name VARCHAR(255) NOT NULL,
    checksum VARCHAR(128),
    row_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dataset_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. PROJECT SNAPSHOTS TABLE (Phase 13)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    physical_progress NUMERIC(5, 2) DEFAULT 0.0,
    financial_progress NUMERIC(5, 2) DEFAULT 0.0,
    expenditure NUMERIC(15, 2) DEFAULT 0.0,
    reported_cost NUMERIC(15, 2),
    reported_completion_date DATE,
    source_dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, snapshot_date)
);

-- ------------------------------------------------------------
-- 5. PROJECT RISK SCORES TABLE (Phase 14)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    snapshot_id UUID REFERENCES project_snapshots(id) ON DELETE SET NULL,
    cost_risk NUMERIC(5, 2) DEFAULT 0.0,
    delay_risk NUMERIC(5, 2) DEFAULT 0.0,
    overall_risk NUMERIC(5, 2) DEFAULT 0.0,
    risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    priority_score INT DEFAULT 0,
    model_version VARCHAR(100),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 6. ML PREDICTION TABLE & RISK DRIVERS (Phase 15, 16)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ml_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    snapshot_id UUID REFERENCES project_snapshots(id) ON DELETE SET NULL,
    model_version VARCHAR(100) NOT NULL,
    predicted_cost_overrun NUMERIC(15, 2),
    predicted_delay_months NUMERIC(5, 1),
    risk_probability NUMERIC(5, 4) CHECK (risk_probability BETWEEN 0 AND 1),
    risk_level VARCHAR(50) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    prediction_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID NOT NULL REFERENCES ml_predictions(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    feature_value NUMERIC(15, 4),
    contribution NUMERIC(10, 4),
    direction VARCHAR(50) DEFAULT 'INCREASE_RISK',
    rank INT NOT NULL
);

-- ------------------------------------------------------------
-- 7. EARLY WARNINGS TABLE (Phase 17)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS early_warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    snapshot_id UUID REFERENCES project_snapshots(id) ON DELETE SET NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    warning_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    evidence JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ------------------------------------------------------------
-- 8. DOCUMENTS & DOCUMENT CHUNKS TABLE (Phase 37, 45, 47)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) DEFAULT 'pdf',
    storage_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    checksum VARCHAR(128),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processing_status VARCHAR(50) DEFAULT 'UPLOADING' CHECK (processing_status IN ('UPLOADING', 'EXTRACTING', 'CHUNKING', 'EMBEDDING', 'READY', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    page_number INT,
    section VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(384), -- Dimension for all-MiniLM-L6-v2
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 9. AUDIT & AI RUN LOGS (Phase 138, 139)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_run_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id VARCHAR(100) NOT NULL,
    request JSONB NOT NULL,
    agents_used TEXT[],
    execution_time_ms INT,
    status VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    retrieval_references JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- PERFORMANCE INDEXES (Phase 161)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_ministry ON projects(ministry);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state);
CREATE INDEX IF NOT EXISTS idx_snapshots_project_date ON project_snapshots(project_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_risk_level ON project_risk_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_document_chunks_proj ON document_chunks(project_id);

-- Vector Similarity Index
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
