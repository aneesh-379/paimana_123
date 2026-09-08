You are the principal software architect and senior full-stack engineer
responsible for completing the non-ML portion of a serious hackathon
project for SIH Problem Statement 103.

IMPORTANT:

The machine-learning models are being developed separately.

DO NOT spend implementation effort training ML models.

DO NOT invent model weights.

DO NOT generate fake prediction values.

Instead, build a clean ML integration layer that can consume the
final trained model service/artifacts once they are provided.

The rest of the system must be fully functional independently.

============================================================
PROJECT OBJECTIVE
============================================================

Build an intelligent web-based project monitoring and decision-support
platform around PAIMANA project monitoring data.

The platform must allow an authorized government/project-monitoring user
to:

1. Upload/import project data.
2. Store project information.
3. Track project history.
4. View project financial and physical status.
5. Receive ML-generated cost/time/risk predictions.
6. Understand the reasons behind predictions.
7. Search government project documents/contracts.
8. Ask questions about contracts.
9. Identify applicable contractual clauses.
10. Calculate financial/schedule implications.
11. Generate evidence-backed mitigation recommendations.
12. Interact with multiple AI agents.
13. Use an orchestrator to coordinate those agents.
14. View everything through a professional dashboard.
15. Maintain complete audit trails.
16. Never allow the AI to fabricate government facts.

The system must feel like a real government project-monitoring
decision-support platform, NOT a generic chatbot dashboard.

============================================================
TECHNOLOGY STACK
============================================================

Frontend:

Vue 3
TypeScript
Vite
Vue Router
Pinia
Tailwind CSS
shadcn-vue or equivalent component library
Apache ECharts / Chart.js
Axios

Backend:

Node.js
TypeScript
Express.js

Database:

Supabase
PostgreSQL
pgvector

AI orchestration:

LangChain/LangGraph OR CrewAI

Prefer LangGraph if implementing explicit stateful orchestration.

LLM:

Provider abstraction.

The implementation must support an LLM provider such as:

Gemini
OpenAI-compatible APIs
local/open-source model

Do not hard-code the entire architecture around one provider.

Document processing:

PDF text extraction
chunking
embeddings
pgvector

ML:

EXTERNAL SERVICE / ARTIFACT

The backend must communicate with the ML layer through a clean
interface.

============================================================
ARCHITECTURAL PRINCIPLE
============================================================

The architecture must be:

                    Vue Frontend
                         |
                         v
                    Express API
                         |
          +--------------+---------------+
          |              |               |
          v              v               v
       Supabase       ML Service      Agent System
          |              |               |
          |              |        +------+------+
          |              |        |             |
          |              |        v             v
          |              |    RAG System    Tools/Services
          |              |        |             |
          |              |        +------+------+
          |              |               |
          |              |               v
          |              |         Orchestrator
          |              |               |
          +--------------+---------------+
                         |
                         v
                  Final Grounded Result
                         |
                         v
                    Vue Frontend


============================================================
SECTION 1 — PROJECT AUDIT
============================================================

PHASE 1 — Inspect Repository

Before writing code:

Inspect the entire repository.

Identify:

frontend
backend
ML code
datasets
documents
models
scripts
configuration
documentation
tests

Do not delete working code.

------------------------------------------------------------

PHASE 2 — Understand Existing ML Boundary

Identify exactly what the future ML system will provide.

Assume the ML system will eventually provide:

predicted_cost_overrun
predicted_delay
risk_score
risk_level
risk_drivers
model_version

Do not assume exact implementation.

Create an abstraction around these outputs.

------------------------------------------------------------

PHASE 3 — Create PROJECT_AUDIT.md

Document:

existing components
working components
missing components
broken components
ML dependencies
frontend dependencies
backend dependencies
database requirements

------------------------------------------------------------

PHASE 4 — Define System Contract

Create:

docs/system-contract.md

Define communication contracts between:

frontend
backend
database
ML service
agent system

============================================================
SECTION 2 — REPOSITORY STRUCTURE
============================================================

PHASE 5 — Backend Structure

Create:

backend/
    src/
        config/
        controllers/
        routes/
        services/
        repositories/
        middleware/
        schemas/
        agents/
        workflows/
        rag/
        ml/
        tools/
        workers/
        utils/
        types/
        app.ts
        server.ts

------------------------------------------------------------

PHASE 6 — Frontend Structure

Create:

frontend/
    src/
        components/
        views/
        layouts/
        stores/
        services/
        composables/
        router/
        types/
        utils/
        assets/

------------------------------------------------------------

PHASE 7 — Documentation Structure

Create:

docs/
    architecture/
    api/
    agents/
    workflows/
    database/
    deployment/
    demo/

============================================================
SECTION 3 — ENVIRONMENT
============================================================

PHASE 8 — Environment Configuration

Create:

.env.example

Include:

PORT
NODE_ENV

SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

LLM_PROVIDER
LLM_API_KEY
LLM_MODEL

ML_SERVICE_URL
ML_SERVICE_TIMEOUT

EMBEDDING_PROVIDER
EMBEDDING_API_KEY
EMBEDDING_MODEL

DOCUMENT_STORAGE_BUCKET

CORS_ORIGIN

LOG_LEVEL

------------------------------------------------------------

PHASE 9 — Environment Validation

At startup:

validate required variables.

Never silently continue with missing production secrets.

------------------------------------------------------------

PHASE 10 — Secret Protection

Never expose:

service role key
LLM API key
ML credentials

to Vue frontend.

============================================================
SECTION 4 — SUPABASE DATABASE
============================================================

PHASE 11 — Users Table

Create:

users

Fields:

id
email
name
role
department
created_at
updated_at

Roles:

ADMIN
ANALYST
OFFICER
VIEWER

------------------------------------------------------------

PHASE 12 — Projects Table

Create:

projects

Fields:

id
project_code
project_name
sector
ministry
department
implementing_agency
state
district
original_cost
revised_cost
original_completion_date
revised_completion_date
actual_completion_date
status
description
created_at
updated_at

project_code must be unique.

------------------------------------------------------------

PHASE 13 — Project Snapshots

Create:

project_snapshots

Store monthly/project update observations.

Fields:

id
project_id
snapshot_date
physical_progress
financial_progress
expenditure
reported_cost
reported_completion_date
source_dataset_id
created_at

------------------------------------------------------------

PHASE 14 — Project Risk Table

Create:

project_risk_scores

Fields:

id
project_id
snapshot_id
cost_risk
delay_risk
overall_risk
risk_level
priority_score
model_version
generated_at

------------------------------------------------------------

PHASE 15 — ML Prediction Table

Create:

ml_predictions

Store raw model outputs.

Fields:

id
project_id
snapshot_id
model_version
predicted_cost_overrun
predicted_delay_months
risk_probability
risk_level
prediction_metadata
created_at

------------------------------------------------------------

PHASE 16 — Risk Drivers

Create:

risk_drivers

Fields:

id
prediction_id
feature_name
feature_value
contribution
direction
rank

This allows the frontend and agents to access explainability results.

------------------------------------------------------------

PHASE 17 — Early Warnings

Create:

early_warnings

Fields:

id
project_id
snapshot_id
severity
warning_type
title
description
evidence
status
created_at
acknowledged_at
resolved_at

------------------------------------------------------------

PHASE 18 — Dataset Registry

Create:

datasets

Store:

dataset_name
source
reporting_period
file_name
checksum
row_count
status
uploaded_by
created_at

------------------------------------------------------------

PHASE 19 — Dataset Import Jobs

Create:

dataset_import_jobs

Track:

queued
processing
completed
failed

with:

error_message
started_at
completed_at

============================================================
SECTION 5 — PROJECT DATA INGESTION
============================================================

PHASE 20 — CSV Upload API

Create:

POST /api/v1/datasets/upload

Accept CSV.

Validate:

file type
size
encoding
headers

------------------------------------------------------------

PHASE 21 — CSV Parser

Parse safely.

Handle:

commas
quotes
empty values
numeric fields
dates

------------------------------------------------------------

PHASE 22 — Schema Mapping

Map source columns into normalized fields.

Example:

"Project Code"
→ project_code

"Physical Progress (%)"
→ physical_progress

------------------------------------------------------------

PHASE 23 — Import Preview

Before committing:

return:

detected columns
mapped columns
unmapped columns
row count
validation errors
warnings

------------------------------------------------------------

PHASE 24 — Import Confirmation

Only after validation:

insert records.

------------------------------------------------------------

PHASE 25 — Duplicate Protection

Prevent duplicate project snapshots.

Use:

project_id + snapshot_date

or equivalent unique identity.

------------------------------------------------------------

PHASE 26 — Import Audit

Record:

who uploaded
when
what dataset
how many rows
how many succeeded
how many failed

============================================================
SECTION 6 — ML INTEGRATION
============================================================

IMPORTANT:

DO NOT IMPLEMENT MODEL TRAINING HERE.

============================================================

PHASE 27 — ML Client

Create:

MLClient

Methods:

predictProject()
getModelHealth()
getModelMetadata()

------------------------------------------------------------

PHASE 28 — ML Request Schema

Define:

MLPredictionRequest

containing only approved project features.

------------------------------------------------------------

PHASE 29 — ML Response Schema

Expected structure:

{
    projectId,
    predictionTimestamp,
    modelVersion,
    predictedCostOverrun,
    predictedDelayMonths,
    riskProbability,
    riskLevel,
    riskDrivers
}

------------------------------------------------------------

PHASE 30 — ML Timeout

Configure timeout.

If ML service does not respond:

return controlled error.

------------------------------------------------------------

PHASE 31 — ML Retry

Retry only transient failures.

Never endlessly retry.

------------------------------------------------------------

PHASE 32 — ML Result Validation

Validate:

probabilities 0–1
risk level enum
numeric values
project identity
model version

------------------------------------------------------------

PHASE 33 — ML Persistence

Store valid predictions in:

ml_predictions

------------------------------------------------------------

PHASE 34 — Prediction Trigger

When a new valid project snapshot is imported:

optionally trigger ML prediction asynchronously.

Do not block CSV upload unnecessarily.

------------------------------------------------------------

PHASE 35 — Prediction History

Allow users to see:

previous predictions
current prediction
prediction change

============================================================
SECTION 7 — DOCUMENT / CONTRACT SYSTEM
============================================================

This section is critical.

The system must support uploaded government/project documents.

============================================================

PHASE 36 — Document Storage

Use Supabase Storage.

Create bucket:

project-documents

------------------------------------------------------------

PHASE 37 — Document Registry

Create:

documents

Fields:

id
project_id
file_name
file_type
storage_path
file_size
checksum
uploaded_by
processing_status
created_at

------------------------------------------------------------

PHASE 38 — PDF Upload

Create:

POST /api/v1/projects/:projectId/documents

Accept:

PDF

------------------------------------------------------------

PHASE 39 — PDF Validation

Validate:

file extension
MIME type
file size
file integrity

------------------------------------------------------------

PHASE 40 — Text Extraction

Extract text from PDF.

Store extraction status.

------------------------------------------------------------

PHASE 41 — OCR Boundary

Do not introduce vision/OCR unless explicitly required.

If PDF has no extractable text:

return:

"Text extraction unavailable."

Do not pretend the document was understood.

------------------------------------------------------------

PHASE 42 — Document Cleaning

Normalize:

whitespace
headers
footers
page breaks

Preserve meaningful structure.

------------------------------------------------------------

PHASE 43 — Document Sections

Detect:

clauses
sections
headings
annexures

where possible.

------------------------------------------------------------

PHASE 44 — Chunking

Split documents into meaningful chunks.

Do NOT blindly split every N characters.

Prefer:

section-aware
paragraph-aware
clause-aware

chunking.

------------------------------------------------------------

PHASE 45 — Document Chunks Table

Create:

document_chunks

Fields:

id
document_id
project_id
chunk_index
content
page_number
section
metadata
embedding

------------------------------------------------------------

PHASE 46 — Embeddings

Generate embeddings for chunks.

Store using pgvector.

------------------------------------------------------------

PHASE 47 — Vector Index

Create appropriate pgvector index.

------------------------------------------------------------

PHASE 48 — Semantic Search

Create:

searchProjectDocuments()

Input:

project_id
query

Return:

top relevant chunks.

------------------------------------------------------------

PHASE 49 — Hybrid Retrieval

Where useful, combine:

semantic similarity
keyword matching
metadata filtering

------------------------------------------------------------

PHASE 50 — Citation System

Every retrieved document chunk must retain:

document
page
section
chunk ID

The AI must be able to cite the source.

============================================================
SECTION 8 — RAG SYSTEM
============================================================

PHASE 51 — RAG Service

Create:

RAGService

Methods:

retrieve()
rerank()
buildContext()

------------------------------------------------------------

PHASE 52 — Project-scoped Retrieval

If analyzing Project A:

do not accidentally retrieve Project B's contract.

Always filter by project_id.

------------------------------------------------------------

PHASE 53 — Retrieval Limits

Never send an entire contract to the LLM.

Retrieve only relevant chunks.

------------------------------------------------------------

PHASE 54 — Context Builder

Build:

DocumentEvidenceBundle

containing:

document name
page
section
text
similarity score

------------------------------------------------------------

PHASE 55 — RAG Grounding

LLM must only claim contractual facts supported by retrieved
document evidence.

------------------------------------------------------------

PHASE 56 — Contract Clause Search

Support questions such as:

"What happens if the project is delayed?"

"What is the penalty clause?"

"What are the contractor obligations?"

"What is the completion deadline?"

============================================================
SECTION 9 — AGENT ARCHITECTURE
============================================================

Use four primary specialized agents.

Do not create four agents that all do the same thing.

============================================================

PHASE 57 — Base Agent

Create:

BaseAgent

Every agent must have:

name
description
input schema
output schema
tools
run()
validate()
fallback()

------------------------------------------------------------

PHASE 58 — Quantitative Agent

Responsibilities:

retrieve project metrics
retrieve ML prediction
retrieve risk drivers
calculate financial implications
compare current vs previous status
calculate deterministic metrics

The agent must NOT invent numbers.

It receives numbers from backend tools.

------------------------------------------------------------

PHASE 59 — Quantitative Agent Tools

Tools:

getProject()
getProjectHistory()
getMLPrediction()
getRiskDrivers()
calculateFinancialGap()
calculateProgressGap()

------------------------------------------------------------

PHASE 60 — Compliance Agent

Responsibilities:

retrieve project documents
search contractual clauses
identify relevant clauses
extract deadlines
identify penalties
identify obligations

The agent must cite:

document
page
section

------------------------------------------------------------

PHASE 61 — Compliance Agent Tools

Tools:

searchDocuments()
getDocument()
getClause()
getProjectContracts()

------------------------------------------------------------

PHASE 62 — Mitigation Agent

Responsibilities:

receive quantitative findings
receive compliance findings
identify evidence-backed response options
draft suggested actions
draft warning/communication

It must NOT independently invent contractual penalties.

------------------------------------------------------------

PHASE 63 — Mitigation Agent Output

Return:

risk_summary
recommended_actions
priority
reason
supporting_evidence
draft_notice

------------------------------------------------------------

PHASE 64 — Orchestrator Agent

The orchestrator is not simply another chatbot.

It manages:

intent
agent selection
tool selection
workflow state
context
validation
failure handling
final response

------------------------------------------------------------

PHASE 65 — Agent Registry

Create:

AgentRegistry

Register:

QuantitativeAgent
ComplianceAgent
MitigationAgent
OrchestratorAgent

============================================================
SECTION 10 — ORCHESTRATION ENGINE
============================================================

PHASE 66 — Intent Detection

Detect:

PROJECT_STATUS
PROJECT_RISK
CONTRACT_QUERY
COMPLIANCE_QUERY
FINANCIAL_ANALYSIS
DELAY_ANALYSIS
MITIGATION
WARNING_DRAFT
PORTFOLIO_ANALYSIS

------------------------------------------------------------

PHASE 67 — Workflow Selection

Example:

"Why is this project risky?"

→ Quantitative Agent

"Does the contract contain a delay penalty?"

→ Compliance Agent

"What should we do?"

→ Quantitative
→ Compliance
→ Mitigation

------------------------------------------------------------

PHASE 68 — Workflow State

Use explicit states:

START
INTENT_IDENTIFIED
DATA_RETRIEVED
ML_RETRIEVED
DOCUMENT_RETRIEVED
AGENTS_RUNNING
RESULTS_VALIDATED
FINAL_RESPONSE
COMPLETED
FAILED

------------------------------------------------------------

PHASE 69 — Evidence Bundle

Create:

EvidenceBundle

containing:

project facts
historical facts
ML prediction
risk drivers
contract evidence
calculated metrics

------------------------------------------------------------

PHASE 70 — Agent Context Isolation

Agents should receive only relevant information.

Compliance Agent does not need the entire project database.

Quantitative Agent does not need entire contracts.

------------------------------------------------------------

PHASE 71 — Parallel Agent Execution

When agents are independent:

run them in parallel.

Example:

Quantitative Agent
+
Compliance Agent

can execute simultaneously.

------------------------------------------------------------

PHASE 72 — Dependency Execution

Mitigation Agent waits until:

Quantitative Agent

and

Compliance Agent

finish.

------------------------------------------------------------

PHASE 73 — Agent Failure Handling

If Compliance Agent fails:

Quantitative analysis can still complete.

Mitigation must state:

"Contractual analysis unavailable."

------------------------------------------------------------

PHASE 74 — Agent Output Validation

Validate:

schema
numbers
project ID
evidence
citations

------------------------------------------------------------

PHASE 75 — Final Grounding

Before final answer:

verify every numerical claim against backend evidence.

============================================================
SECTION 11 — AI SAFETY
============================================================

PHASE 76 — No Hallucinated Government Facts

AI cannot invent:

project cost
penalty
deadline
contract clause
government rule
risk score

------------------------------------------------------------

PHASE 77 — No Unsupported Legal Advice

The Compliance Agent provides:

contract interpretation

not:

legal judgment.

Use wording such as:

"The uploaded contract states..."

rather than:

"The government law requires..."

unless authoritative legal material is actually available.

------------------------------------------------------------

PHASE 78 — No Autonomous Enforcement

AI can:

draft warning

recommend review

suggest action

AI cannot:

send legal notice automatically
terminate contract
impose penalty
change project data

without human confirmation.

------------------------------------------------------------

PHASE 79 — Human Approval

Any consequential action must require:

human confirmation.

============================================================
SECTION 12 — AGENT WORKFLOWS
============================================================

PHASE 80 — Project Status Workflow

User:

"Check the status of Highway Project X."

Workflow:

Orchestrator
↓
Quantitative Agent
↓
Project data
↓
ML prediction
↓
historical comparison
↓
final summary

------------------------------------------------------------

PHASE 81 — Risk Workflow

User:

"Why is Project X high risk?"

Workflow:

Project
↓
history
↓
ML
↓
risk drivers
↓
Quantitative Agent
↓
validated explanation

------------------------------------------------------------

PHASE 82 — Compliance Workflow

User:

"What happens if this project is delayed?"

Workflow:

Orchestrator
↓
Compliance Agent
↓
RAG retrieval
↓
contract clauses
↓
citations
↓
answer

------------------------------------------------------------

PHASE 83 — Full Intervention Workflow

User:

"The project is 4 months delayed. What should we do?"

Workflow:

Orchestrator
↓
Quantitative Agent
↓
ML prediction
↓
Compliance Agent
↓
contract retrieval
↓
Mitigation Agent
↓
evidence validation
↓
draft recommendations

------------------------------------------------------------

PHASE 84 — Warning Draft Workflow

User:

"Draft a warning notice."

Workflow:

retrieve project

retrieve quantitative evidence

retrieve applicable contract clauses

generate draft

show preview

require human approval

NEVER automatically send.

============================================================
SECTION 13 — BACKEND API
============================================================

PHASE 85 — Authentication APIs

Implement:

POST /api/v1/auth/login
POST /api/v1/auth/logout
GET /api/v1/auth/me

------------------------------------------------------------

PHASE 86 — Project APIs

GET /api/v1/projects

GET /api/v1/projects/:id

GET /api/v1/projects/:id/history

GET /api/v1/projects/:id/risk

GET /api/v1/projects/:id/predictions

------------------------------------------------------------

PHASE 87 — Dataset APIs

POST /api/v1/datasets/upload

GET /api/v1/datasets

GET /api/v1/datasets/:id

------------------------------------------------------------

PHASE 88 — Document APIs

POST /api/v1/projects/:id/documents

GET /api/v1/projects/:id/documents

DELETE /api/v1/documents/:id

POST /api/v1/documents/:id/process

------------------------------------------------------------

PHASE 89 — Risk APIs

GET /api/v1/risk/projects

GET /api/v1/risk/critical

GET /api/v1/risk/trends

------------------------------------------------------------

PHASE 90 — Warning APIs

GET /api/v1/warnings

GET /api/v1/warnings/:id

PATCH /api/v1/warnings/:id

------------------------------------------------------------

PHASE 91 — AI API

POST /api/v1/ai/query

Request:

{
    projectId,
    message
}

Response:

{
    answer,
    workflow,
    agentsUsed,
    evidence,
    citations,
    confidence
}

------------------------------------------------------------

PHASE 92 — Draft Action API

POST /api/v1/actions/draft-warning

Returns a draft only.

------------------------------------------------------------

PHASE 93 — Human Approval API

POST /api/v1/actions/:id/approve

Requires authorized user.

============================================================
SECTION 14 — FRONTEND FOUNDATION
============================================================

PHASE 94 — Vue Application

Create:

Vue 3 + TypeScript + Vite.

------------------------------------------------------------

PHASE 95 — Router

Routes:

/login
/dashboard
/projects
/projects/:id
/risk
/warnings
/documents
/analytics
/ai
/reports
/admin

------------------------------------------------------------

PHASE 96 — Authentication Store

Pinia store:

authStore

Handle:

user
role
session
logout

------------------------------------------------------------

PHASE 97 — API Client

Create centralized Axios client.

Handle:

authentication
errors
timeouts
request IDs

------------------------------------------------------------

PHASE 98 — Application Layout

Create:

sidebar
top navigation
content area
notifications
user menu

============================================================
SECTION 15 — DASHBOARD
============================================================

PHASE 99 — Executive Dashboard

Display:

Total Projects

Total Original Cost

Total Revised Cost

Total Expenditure

High Risk Projects

Critical Projects

Projects With Warnings

Average Physical Progress

------------------------------------------------------------

PHASE 100 — Risk Distribution

Chart:

LOW
MEDIUM
HIGH
CRITICAL

------------------------------------------------------------

PHASE 101 — Project Risk Ranking

Table:

Project

Risk

Cost Risk

Delay Risk

Progress

Expenditure

Status

------------------------------------------------------------

PHASE 102 — Critical Project Panel

Show highest-priority projects.

------------------------------------------------------------

PHASE 103 — Trend Panel

Show:

risk trend
cost escalation
physical progress
expenditure

============================================================
SECTION 16 — PROJECT DETAIL UI
============================================================

PHASE 104 — Project Overview

Display:

project code
project name
sector
ministry
agency
state
cost
status

------------------------------------------------------------

PHASE 105 — Financial Tab

Show:

original cost
revised cost
expenditure
cost escalation
financial progress

------------------------------------------------------------

PHASE 106 — Progress Tab

Show:

physical progress
expected/target progress if available
progress gap
historical progression

------------------------------------------------------------

PHASE 107 — Timeline

Show:

sanction
original completion
revisions
current status
actual completion if available

------------------------------------------------------------

PHASE 108 — ML Risk Tab

Show:

predicted cost overrun
predicted delay
risk probability
risk level
model version

Clearly label these as:

MODEL PREDICTION

------------------------------------------------------------

PHASE 109 — Risk Drivers

Display the strongest model drivers.

For example:

High expenditure relative to physical progress

Do not display unsupported explanations.

------------------------------------------------------------

PHASE 110 — Contract Tab

Display:

uploaded documents
processing status
search

------------------------------------------------------------

PHASE 111 — AI Analysis Tab

Show:

AI interpretation

Evidence

Agents used

Recommendations

============================================================
SECTION 17 — RISK MONITOR
============================================================

PHASE 112 — Risk Dashboard

Filters:

risk level
sector
ministry
state
agency
cost range

------------------------------------------------------------

PHASE 113 — Risk Matrix

X:

cost risk

Y:

delay risk

Bubble size:

project cost

------------------------------------------------------------

PHASE 114 — Early Warning Center

Display:

critical
high
medium
resolved

------------------------------------------------------------

PHASE 115 — Warning Details

Show:

why warning triggered
metric
threshold
project
date
evidence

============================================================
SECTION 18 — AI CHAT
============================================================

PHASE 116 — AI Assistant UI

Create professional chat interface.

------------------------------------------------------------

PHASE 117 — Context Selection

User can select:

project

sector

portfolio

before asking.

------------------------------------------------------------

PHASE 118 — Suggested Questions

Examples:

"Why is this project high risk?"

"What caused the increase in risk?"

"What does the contract say about delay?"

"What is the penalty clause?"

"What should the monitoring officer review?"

"Draft a warning notice."

------------------------------------------------------------

PHASE 119 — Agent Trace UI

Do not expose hidden chain-of-thought.

Instead show high-level execution trace:

✓ Project data retrieved

✓ ML prediction retrieved

✓ Contract searched

✓ Compliance clause found

✓ Recommendation generated

------------------------------------------------------------

PHASE 120 — Evidence Cards

Show:

Source

Metric

Document

Page

Model version

Snapshot date

------------------------------------------------------------

PHASE 121 — Confidence

Display:

HIGH
MEDIUM
LOW

with explanation where useful.

============================================================
SECTION 19 — CONTRACT/RAG UI
============================================================

PHASE 122 — Document Upload Page

Allow:

PDF upload

------------------------------------------------------------

PHASE 123 — Processing Status

Show:

Uploading

Extracting

Chunking

Embedding

Ready

Failed

------------------------------------------------------------

PHASE 124 — Contract Search

Search:

"delay penalty"

"completion period"

"termination"

"liquidated damages"

------------------------------------------------------------

PHASE 125 — Clause Viewer

Display:

document
page
section
clause text

------------------------------------------------------------

PHASE 126 — Ask Document

Allow:

"What does this contract say about delay?"

Return grounded answer + citations.

============================================================
SECTION 20 — MITIGATION UI
============================================================

PHASE 127 — Recommendation Panel

Show:

Issue

Evidence

Contract implication

Recommended review action

Priority

------------------------------------------------------------

PHASE 128 — Warning Draft

Display generated draft in editable form.

------------------------------------------------------------

PHASE 129 — Human Approval

Buttons:

Approve

Edit

Reject

------------------------------------------------------------

PHASE 130 — Audit

Record:

who approved
when
what changed

============================================================
SECTION 21 — NOTIFICATIONS
============================================================

PHASE 131 — Notification Service

Create abstraction:

NotificationService

------------------------------------------------------------

PHASE 132 — Channels

Prepare interfaces for:

Email

SMS

WhatsApp

in-app

Do not require external messaging integration for MVP.

------------------------------------------------------------

PHASE 133 — Notification Events

Trigger notifications for:

critical risk

new warning

risk deterioration

document processing complete

ML prediction complete

------------------------------------------------------------

PHASE 134 — Human Confirmation

No external warning/notification should be sent automatically
without the configured approval workflow.

============================================================
SECTION 22 — REPORTING
============================================================

PHASE 135 — Project Report

Generate:

project summary
financial status
physical status
ML risk
risk drivers
contract findings
recommendations

------------------------------------------------------------

PHASE 136 — Portfolio Report

Generate:

total projects
risk distribution
critical projects
sector analysis
financial exposure
warnings

------------------------------------------------------------

PHASE 137 — Export

Support:

PDF

CSV

where appropriate.

============================================================
SECTION 23 — AUDITABILITY
============================================================

PHASE 138 — Audit Logs

Create:

audit_logs

Store:

user
action
resource
timestamp
before
after

------------------------------------------------------------

PHASE 139 — AI Run Logs

Store:

workflow_id
request
agents_used
execution time
status
model
retrieval references

Do not store secrets.

------------------------------------------------------------

PHASE 140 — Evidence Lineage

Every AI answer must be traceable to:

project
snapshot
ML prediction
document chunk
calculation

where applicable.

============================================================
SECTION 24 — SECURITY
============================================================

PHASE 141 — RBAC

ADMIN:

everything

ANALYST:

analytics
projects
AI

OFFICER:

project monitoring
warnings
recommendations

VIEWER:

read-only

------------------------------------------------------------

PHASE 142 — API Authorization

Every protected endpoint must enforce role.

------------------------------------------------------------

PHASE 143 — File Security

Validate:

file size
MIME
extension

Prevent:

path traversal
malicious filenames

------------------------------------------------------------

PHASE 144 — Prompt Injection Protection

Documents are untrusted data.

Never allow document text to become system instructions.

------------------------------------------------------------

PHASE 145 — SQL Security

Use parameterized queries / Supabase APIs.

------------------------------------------------------------

PHASE 146 — Rate Limiting

Protect:

AI endpoints
upload endpoints
search endpoints

============================================================
SECTION 25 — ERROR HANDLING
============================================================

PHASE 147 — Global Error Handler

All errors should become structured API responses.

------------------------------------------------------------

PHASE 148 — Request IDs

Every request gets a request ID.

------------------------------------------------------------

PHASE 149 — AI Failure

If LLM fails:

return deterministic information where possible.

------------------------------------------------------------

PHASE 150 — RAG Failure

If document retrieval fails:

say:

"Contract analysis unavailable."

Do not fabricate.

------------------------------------------------------------

PHASE 151 — ML Failure

If ML service fails:

show existing stored prediction if available.

Otherwise:

"Prediction unavailable."

============================================================
SECTION 26 — TESTING
============================================================

PHASE 152 — Database Tests

Test:

project insertion
snapshot insertion
duplicate prevention
relationships

------------------------------------------------------------

PHASE 153 — API Tests

Test:

authentication
projects
datasets
documents
risk
AI

------------------------------------------------------------

PHASE 154 — ML Integration Tests

Mock ML service.

Verify:

request schema
response schema
validation
failure handling

------------------------------------------------------------

PHASE 155 — RAG Tests

Test:

PDF ingestion
chunking
embedding
retrieval
citation

------------------------------------------------------------

PHASE 156 — Agent Tests

Mock evidence.

Test:

Quantitative Agent

Compliance Agent

Mitigation Agent

------------------------------------------------------------

PHASE 157 — Orchestrator Tests

Test:

correct agent selection
workflow dependencies
parallel execution
failure recovery

------------------------------------------------------------

PHASE 158 — Grounding Tests

Create known questions with known answers.

Verify AI does not invent values.

------------------------------------------------------------

PHASE 159 — Security Tests

Test:

RBAC
file upload
prompt injection
unauthorized APIs
rate limits

------------------------------------------------------------

PHASE 160 — Frontend E2E

Test:

login

dashboard

project search

project details

risk

document upload

AI chat

warning approval

============================================================
SECTION 27 — PERFORMANCE
============================================================

PHASE 161 — Database Indexes

Index:

project_code
snapshot_date
risk_level
sector
ministry
state

------------------------------------------------------------

PHASE 162 — Query Optimization

Do not retrieve unnecessary rows.

------------------------------------------------------------

PHASE 163 — AI Context Optimization

Never send:

entire database
entire project history
entire contract

to LLM.

Only send relevant evidence.

------------------------------------------------------------

PHASE 164 — Embedding Optimization

Do not regenerate embeddings for unchanged documents.

Use checksum.

------------------------------------------------------------

PHASE 165 — Caching

Cache:

project summaries
risk summaries
document retrieval where appropriate

============================================================
SECTION 28 — BACKGROUND WORKERS
============================================================

PHASE 166 — Import Worker

Process large CSV uploads asynchronously.

------------------------------------------------------------

PHASE 167 — Document Worker

Process:

PDF
text
chunks
embeddings

asynchronously.

------------------------------------------------------------

PHASE 168 — Prediction Worker

After snapshot ingestion:

call ML service.

------------------------------------------------------------

PHASE 169 — Risk Worker

Generate/update risk records.

------------------------------------------------------------

PHASE 170 — Warning Worker

Detect:

new warnings
risk deterioration

============================================================
SECTION 29 — DEMO WORKFLOW
============================================================

PHASE 171 — Seed Realistic Data

Use official/project dataset where available.

Do not fabricate official records.

If test data is required:

clearly label it DEMO DATA.

------------------------------------------------------------

PHASE 172 — Demo Project Selection

Choose a real project with enough information to demonstrate:

cost

progress

risk

history

and preferably contract/document evidence.

------------------------------------------------------------

PHASE 173 — Demo Step 1

Open dashboard.

Show portfolio KPIs.

------------------------------------------------------------

PHASE 174 — Demo Step 2

Open Risk Monitor.

Show high-risk project.

------------------------------------------------------------

PHASE 175 — Demo Step 3

Open project.

Show:

financial

physical

schedule

risk

------------------------------------------------------------

PHASE 176 — Demo Step 4

Open ML Risk tab.

Show actual model output from ML service.

------------------------------------------------------------

PHASE 177 — Demo Step 5

Show risk drivers.

------------------------------------------------------------

PHASE 178 — Demo Step 6

Ask:

"Why is this project high risk?"

Quantitative Agent answers.

------------------------------------------------------------

PHASE 179 — Demo Step 7

Ask:

"What does the contract say about delay?"

Compliance Agent searches document.

------------------------------------------------------------

PHASE 180 — Demo Step 8

Ask:

"What should the officer do?"

Quantitative findings
+
contract findings
→
Mitigation Agent

------------------------------------------------------------

PHASE 181 — Demo Step 9

Generate warning draft.

------------------------------------------------------------

PHASE 182 — Demo Step 10

Human edits/approves.

------------------------------------------------------------

PHASE 183 — Demo Step 11

Audit log records action.

============================================================
SECTION 30 — DEPLOYMENT
============================================================

PHASE 184 — Docker Backend

Create:

Dockerfile

------------------------------------------------------------

PHASE 185 — Docker Frontend

Create production frontend Docker configuration.

------------------------------------------------------------

PHASE 186 — Docker Compose

Create:

frontend
backend

where appropriate.

Supabase remains external.

ML service can remain external.

------------------------------------------------------------

PHASE 187 — Production Environment

Separate:

development

staging

production

------------------------------------------------------------

PHASE 188 — Health Endpoint

Create:

GET /health

Return:

backend
database
ML
LLM
RAG

status.

------------------------------------------------------------

PHASE 189 — Readiness

Create:

GET /ready

Only return ready if critical dependencies are available.

============================================================
SECTION 31 — DOCUMENTATION
============================================================

PHASE 190 — README

Explain:

architecture
installation
environment variables
database setup
running frontend
running backend
ML integration
RAG
AI agents

------------------------------------------------------------

PHASE 191 — Architecture Documentation

Document:

Frontend

Backend

Database

ML

RAG

Agents

Orchestrator

------------------------------------------------------------

PHASE 192 — Agent Documentation

For each agent:

purpose
inputs
tools
outputs
failure behavior

------------------------------------------------------------

PHASE 193 — Workflow Documentation

Document:

Project Risk Workflow

Contract Workflow

Mitigation Workflow

Warning Workflow

------------------------------------------------------------

PHASE 194 — API Documentation

Use:

OpenAPI / Swagger.

------------------------------------------------------------

PHASE 195 — Demo Documentation

Create:

docs/demo-script.md

containing the exact hackathon demonstration flow.

============================================================
SECTION 32 — FINAL QUALITY GATE
============================================================

PHASE 196 — No Fake Data

Verify no hardcoded government project values.

------------------------------------------------------------

PHASE 197 — No Fake ML

Verify every prediction comes from:

ML service

or stored real prediction.

------------------------------------------------------------

PHASE 198 — No Fake Contract Analysis

Verify every contractual answer has:

document evidence
page/section reference

------------------------------------------------------------

PHASE 199 — No Fake Agents

Verify agents actually call tools/services.

------------------------------------------------------------

PHASE 200 — No Fake Orchestration

Verify orchestrator dynamically selects appropriate workflows.

------------------------------------------------------------

PHASE 201 — No Autonomous Government Action

Verify warnings require human approval.

------------------------------------------------------------

PHASE 202 — End-to-End Test

Test:

CSV
→ database
→ snapshot
→ ML
→ risk
→ dashboard
→ AI
→ contract
→ recommendation
→ warning
→ approval
→ audit

------------------------------------------------------------

PHASE 203 — Final Hackathon Polish

Improve:

loading states
error states
empty states
responsive design
chart readability
table filtering
search
navigation
performance

------------------------------------------------------------

PHASE 204 — Final Demo Validation

Run the complete demonstration from a clean environment.

Verify:

frontend starts
backend starts
database connects
ML service connects
documents process
embeddings work
agents execute
orchestrator works
AI responds
citations appear
warnings work
audit logs work

============================================================
FINAL ARCHITECTURAL REQUIREMENT
============================================================

The completed system must demonstrate this exact intelligence loop:

USER
 ↓
VUE DASHBOARD / AI CHAT
 ↓
EXPRESS BACKEND
 ↓
ORCHESTRATOR
 ↓
WORKFLOW PLANNER
 ↓
TOOLS
 ├── Project Database
 ├── Project History
 ├── ML Prediction Service
 ├── Risk Data
 ├── Contract RAG
 └── Benchmark/Analytics
 ↓
EVIDENCE BUNDLE
 ↓
SPECIALIZED AGENTS
 ├── Quantitative Agent
 ├── Compliance Agent
 └── Mitigation Agent
 ↓
ORCHESTRATOR
 ↓
VALIDATION
 ↓
HUMAN-READABLE RESPONSE
 ↓
HUMAN APPROVAL FOR CONSEQUENCES
 ↓
AUDIT LOG

============================================================
MOST IMPORTANT RULE
============================================================

DO NOT BUILD A GENERIC:

"Dashboard + Chatbot"

Build:

PAIMANA PROJECT INTELLIGENCE SYSTEM

where:

DATABASE
provides facts

ML
provides predictions

RAG
provides contractual evidence

QUANTITATIVE AGENT
interprets numerical/project evidence

COMPLIANCE AGENT
interprets retrieved contractual evidence

MITIGATION AGENT
combines evidence into actionable recommendations

ORCHESTRATOR
coordinates the complete workflow

FRONTEND
presents the complete decision-support process

HUMAN
remains the final decision maker.

============================================================
IMPLEMENTATION ORDER
============================================================

Implement in this order:

1. Repository audit
2. Environment
3. Supabase
4. Database schema
5. Data ingestion
6. Project APIs
7. ML integration interface
8. Document storage
9. PDF extraction
10. Chunking
11. Embeddings
12. RAG
13. Agent framework
14. Quantitative Agent
15. Compliance Agent
16. Mitigation Agent
17. Orchestrator
18. Workflows
19. AI API
20. Vue foundation
21. Dashboard
22. Project detail
23. Risk monitor
24. Document UI
25. AI chat
26. Recommendation UI
27. Approval workflow
28. Audit
29. Testing
30. Deployment
31. Demo polish

DO NOT jump directly to the frontend.

DO NOT create mock AI responses merely to make the UI look finished.

Build the underlying system first.

After every major phase:

1. run tests
2. inspect errors
3. fix errors
4. verify existing functionality
5. document changes
6. continue

Never silently skip a failed phase.
The important separation

Your project is now much cleaner if we think of it as 5 independently replaceable layers:

1. ML — you are handling this
PAIMANA data
     ↓
Feature engineering
     ↓
Cost model
Delay model
Risk model
     ↓
weights/artifacts
     ↓
ML API

Antigravity only needs to build the contract/interface for this.

2. Data + Backend
CSV
 │
 ▼
Validation
 │
 ▼
Supabase
 │
 ├── Projects
 ├── Snapshots
 ├── Predictions
 ├── Risk
 ├── Warnings
 └── Documents

This is the backbone.

3. Contract RAG

This is separate from the ML.

PDF Contract
     ↓
Text Extraction
     ↓
Section/Clause Detection
     ↓
Chunking
     ↓
Embeddings
     ↓
pgvector
     ↓
Semantic Retrieval
     ↓
Contract Evidence

So if an officer asks:

"What happens if this contractor delays the project?"

the system doesn't ask the LLM to magically know the contract.

It does:

Question
 ↓
Compliance Agent
 ↓
RAG search
 ↓
Relevant contract
 ↓
Relevant page
 ↓
Relevant clause
 ↓
LLM interpretation

That is far more defensible in a hackathon.

4. The agentic layer

This is where your "AI agents + orchestration" actually becomes meaningful.

Suppose the user says:

"The highway project in Maharashtra is delayed. Check the situation and tell me what action should be taken."

The system should execute:

                    USER
                      │
                      ▼
                 ORCHESTRATOR
                      │
              Understand intent
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
 QUANTITATIVE AGENT        COMPLIANCE AGENT
          │                       │
          ▼                       ▼
     Project data             Contract RAG
     ML prediction            Contract clauses
     Risk drivers             Penalties
     History                  Obligations
          │                       │
          └───────────┬───────────┘
                      ▼
               MITIGATION AGENT
                      │
                      ▼
             Evidence-backed
              recommendations
                      │
                      ▼
                ORCHESTRATOR
                      │
                      ▼
              FINAL RESPONSE

And only then:

"Draft warning notice"
        ↓
Human reviews
        ↓
Human edits
        ↓
Human approves
        ↓
Audit log

That's the workflow I'd demonstrate to judges.

5. And this is where your project becomes really strong

The three agents aren't just three chatbots.

They have different authorities:

Agent	What it can trust
Quantitative Agent	DB + calculations + ML
Compliance Agent	Contract RAG + document evidence
Mitigation Agent	Outputs from other agents + evidence
Orchestrator	Workflow state + validated agent outputs

So you get:

Data → ML → RAG → Agents → Orchestration → Human decision