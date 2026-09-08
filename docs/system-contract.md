# SYSTEM CONTRACT & INTERFACE SPECIFICATIONS
**PAIMANA Infrastructure Monitoring & Decision-Support Platform**

## 1. System Communication Architecture
```
              +-----------------------------------+
              |    Frontend (Vue 3 / React UI)    |
              +-----------------+-----------------+
                                |
                                v
              +-----------------+-----------------+
              |     Express / FastAPI Backend     |
              +----+------------+------------+----+
                   |            |            |
                   v            v            v
           +-------+----+  +----+------+  +--+------------+
           |  Supabase  |  | ML Client |  | Orchestrator  |
           | PostgreSQL |  |  Service  |  |  Agent System |
           +------------+  +-----------+  +-------+-------+
                                                  |
                                           +------+------+
                                           |             |
                                           v             v
                                      RAG System   Specialized Agents
                                      (pgvector)  (Quant, Compliance,
                                                    Mitigation)
```

## 2. API Data Exchange Contracts

### 2.1 Project Ingestion & Snapshot Interface
- **Endpoint:** `POST /api/v1/datasets/upload`
- **Request:** `multipart/form-data` containing CSV dataset file.
- **Response:**
```json
{
  "dataset_id": "DS-2026-001",
  "file_name": "mospi_q1_2026.csv",
  "status": "VALIDATED",
  "summary": {
    "total_rows": 142,
    "valid_rows": 140,
    "error_rows": 2,
    "mapped_columns": ["project_code", "project_name", "original_cost", "revised_cost", "expenditure", "physical_progress", "snapshot_date"]
  }
}
```

### 2.2 ML Prediction Interface (`MLClient`)
- **Endpoint / Method:** `predictProject(projectFeatures: MLPredictionRequest)`
- **Request Schema:**
```json
{
  "project_code": "PAIM-619054",
  "original_cost": 1162.76,
  "revised_cost": 1390.00,
  "expenditure": 494.72,
  "physical_progress": 42.5,
  "sanction_date": "2024-03-01",
  "original_doc": "2027-12-31",
  "snapshot_date": "2026-01-01"
}
```
- **Response Schema:**
```json
{
  "project_id": "PAIM-619054",
  "prediction_timestamp": "2026-09-07T18:10:00Z",
  "model_version": "v2.1.0-xgb",
  "predicted_cost_overrun_pct": 19.5,
  "predicted_delay_months": 16.5,
  "risk_probability": 0.85,
  "risk_level": "HIGH",
  "risk_drivers": [
    {
      "feature_name": "financial_physical_gap",
      "feature_value": 23.4,
      "contribution": 0.42,
      "direction": "HIGH_RISK_INCREASE",
      "rank": 1
    }
  ]
}
```

### 2.3 RAG Retrieval Interface (`RAGService`)
- **Method:** `retrieve(project_id: string, query: string, top_k: int = 5)`
- **Output:** `DocumentEvidenceBundle`
```json
{
  "project_id": "PAIM-619054",
  "query": "What is the penalty for schedule delay?",
  "retrieved_chunks": [
    {
      "chunk_id": "CHK-9921",
      "document_name": "NHAI_Contract_Section_4.pdf",
      "page_number": 42,
      "section": "Clause 14.2 - Liquidated Damages",
      "content": "In the event of delay exceeding 90 days, liquidated damages equal to 0.05% per day of delayed section cost shall be levied up to a maximum of 10% of total contract value.",
      "similarity_score": 0.89
    }
  ]
}
```

### 2.4 Agent System & Orchestrator Interface
- **Endpoint:** `POST /api/v1/ai/query`
- **Request:**
```json
{
  "projectId": "PAIM-619054",
  "message": "Why is this project delayed and what warning should we issue?"
}
```
- **Response:**
```json
{
  "answer": "Project PAIM-619054 has a physical progress of 42.5% against elapsed target timeline. The ML model predicts a 16.5 month delay and 19.5% cost overrun. Clause 14.2 of the contract specifies liquidated damages after 90 days of delay.",
  "workflow": "FULL_INTERVENTION",
  "agents_used": ["QuantitativeAgent", "ComplianceAgent", "MitigationAgent"],
  "evidence": {
    "project_facts": { "physical_progress": 42.5, "expenditure": 494.72 },
    "ml_prediction": { "predicted_delay_months": 16.5, "risk_level": "HIGH" },
    "contract_evidence": [
      { "document": "NHAI_Contract_Section_4.pdf", "page": 42, "section": "Clause 14.2" }
    ]
  },
  "citations": ["NHAI_Contract_Section_4.pdf (Page 42, Clause 14.2)"],
  "confidence": "HIGH",
  "recommended_action": {
    "draft_notice_id": "DRAFT-2026-8812",
    "notice_title": "Formal Show Cause Notice for Schedule Lag",
    "requires_human_approval": true
  }
}
```
