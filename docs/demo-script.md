# PAIMANA AI PLATFORM — HACKATHON DEMO SCRIPT
**SIH Problem Statement 103 — Project Monitoring & Decision-Support System**

## Step-by-Step Demonstration Flow

### Step 1: Open Executive Dashboard
- Navigate to Executive Dashboard tab.
- Highlight Portfolio KPIs:
  - Total Monitored Projects
  - Total Original & Revised Costs
  - Total Expenditure & Escalation Percentage
  - High Risk Projects Flagged
  - Average Physical Progress & Schedule Lag

### Step 2: Inspect High-Risk Project & ML Predictions
- Select high-risk project (e.g. `PAIM-619054` — Greenfield Expressway Expansion).
- Show predictions received from `MLClient`:
  - Predicted Delay: **16.5 months**
  - Predicted Cost Overrun: **+19.5%**
  - Risk Level: **CRITICAL**

### Step 3: Analyze Risk Drivers
- Show deterministic physical vs. financial gap (expenditure leading physical progress by 22%).
- Explain that ML drivers are grounded directly in uploaded project snapshots without hallucination.

### Step 4: Multi-Agent Orchestrator Execution
- Navigate to Agent Orchestrator tab.
- Type prompt: *"Why is this project high risk and what warning notice should we issue?"*
- Observe stateful workflow execution:
  1. `QuantitativeAgent` calculates progress gap & financial metrics.
  2. `ComplianceAgent` retrieves standard contract terms via `RAGService`.
  3. `MitigationAgent` combines evidence into concrete steps and drafts a formal Warning Notice.

### Step 5: Document Citation & Evidence Card
- Inspect retrieved contract evidence:
  - `NHAI_Standard_Contract_GCC_2024.pdf (Page 42, Clause 14.2 — Liquidated Damages for Delay)`
- Verify that every contractual claim cites document name, page, and section.

### Step 6: Human-in-the-Loop Warning Approval
- Review the generated Warning Notice Draft.
- Highlight safety control: AI does **not** autonomously issue legal notices or penalties.
- Click **"Approve & Execute Notice"**.

### Step 7: Audit Trail Verification
- Navigate to Audit Trail tab.
- Confirm that approval action, user role, timestamp, and before/after states are logged immutably.
