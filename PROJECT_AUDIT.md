# PROJECT AUDIT & REPOSITORY ANALYSIS
**SIH Problem Statement 103 — PAIMANA Infrastructure Monitoring Platform**

## 1. Existing & Working Components
- **Backend API (`backend/main.py` & `backend/app/`):** FastAPI application with endpoint structure for project listings, ML risk prediction, early warnings, anomaly detection, benchmarks, what-if simulations, and backtesting.
- **ML Subsystem (`ml/`):** Data provenance tracker, schema guard, feature engineering (`PAIMANAFeatureEngineer`), early warning engine, anomaly detection engine, benchmark engine, CUF gap engine, backtesting engine, what-if engine, report generator.
- **Pre-trained Artifacts & Data (`data/`):** MoSPI dataset processing scripts, processed project datasets (`paimana_real_2001_2026_dataset.csv`), ML models (`paimana_delay_model.joblib`, `paimana_cost_model.joblib`, `paimana_risk_model.joblib`, `feature_engineer.joblib`).
- **Frontend App (`frontend/src/App.jsx`):** Vite + React interface featuring holdout testbench, project risk analysis, early warning alert display, benchmark ranking, what-if simulator, AI assistant tab, report generator, audit logs.

## 2. Missing & Required Enhancements (per `ai_prompt.md`)
- **Database Layer & Schema:** Supabase / PostgreSQL schema definition (`schema.sql`) for `users`, `projects`, `project_snapshots`, `project_risk_scores`, `ml_predictions`, `risk_drivers`, `early_warnings`, `datasets`, `dataset_import_jobs`, `documents`, `document_chunks`, `audit_logs`, `ai_run_logs`, and `pgvector` index integration.
- **ML Integration Abstraction Layer:** `MLClient` interface for clean external model consumption (`predictProject()`, `getModelHealth()`, `getModelMetadata()`), request/response schema validation, retries, timeouts, and persistent logging to `ml_predictions` without hardcoded fake ML values.
- **Document / RAG Engine:** PDF text extraction, document section & clause-aware chunking, vector embedding generation, `pgvector` semantic + hybrid retrieval (`RAGService`), `DocumentEvidenceBundle`, and clause search with exact citations (document, page, section, chunk ID).
- **Specialized Multi-Agent Architecture:** Clean modular agent framework (`BaseAgent`, `QuantitativeAgent`, `ComplianceAgent`, `MitigationAgent`, `OrchestratorAgent`, `AgentRegistry`) with explicit stateful orchestration, intent classification (`PROJECT_STATUS`, `CONTRACT_QUERY`, `MITIGATION`, `WARNING_DRAFT`, etc.), evidence bundle validation, parallel execution, and strict grounding verification.
- **Human Approval & Governance:** Human-in-the-loop warning draft generation (`POST /api/v1/actions/draft-warning`, `POST /api/v1/actions/:id/approve`) ensuring no autonomous legal/administrative action without authorization.
- **Strict Environment & Contract Alignment:** Unified `.env.example`, startup environment variable validation, complete specification contract (`docs/system-contract.md`), and expanded REST API endpoints.

## 3. System Dependencies
- **Backend:** `fastapi`, `uvicorn`, `pydantic`, `pandas`, `numpy`, `scikit-learn`, `joblib`, `python-multipart`, `requests`, `pypdf`/`pdfplumber` for PDF processing.
- **Frontend:** React / Vue 3, Vite, Tailwind CSS, Lucide icons, Recharts / ECharts.
- **Database:** Supabase / PostgreSQL with `pgvector` extension.
