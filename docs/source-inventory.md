# PAIMANA Source Inventory & Data Lineage

This document establishes the official data sources, coverage, usage restrictions, and analytical capabilities for the PAIMANA AI platform in accordance with SIH 2026 Problem Statement SIH26103.

---

## Source 1: Official PAIMANA Public Dashboard
- **URL**: https://paimana-proj.mospi.gov.in/Home/PublicDashboardNew
- **Source Type**: Live Web Portal / Public Dashboard
- **Reporting Period**: Dynamic (Monthly updates by IPMD, MoSPI)
- **Available Fields**:
  - `Sector` (Sector-wise distribution)
  - `Ministry / Department` (Line Ministry)
  - `State / UT` (Geographic location)
  - `Project Cost` (Original Approved Cost, Latest Revised Cost)
  - `Cumulative Expenditure` (₹ Crores)
  - `Physical Progress` (%)
  - `Project Count` (Overall and breakdown)
- **Coverage**: Central sector infrastructure projects costing ₹150 Crore and above monitored by IPMD.
- **Limitations**: Aggregated summary charts on public dashboard; full line-level project details require CSV/XLSX download or official monthly reports.
- **ML & Analytics Classification**:
  - Dashboard Analytics: **YES**
  - ML Training Feature Baseline: **YES** (When paired with monthly snapshot history)

---

## Source 2: Official PAIMANA Monthly Flash / Implementation Reports
- **URL / Document Origin**: Infrastructure & Project Monitoring Division (IPMD), MoSPI Monthly Reports
- **Source Type**: Official Monthly PDF / XLSX Reports
- **Reporting Period**: Historical monthly series (2018 – Present)
- **Available Fields**:
  - `Project Code` / `Project ID`
  - `Project Name`
  - `Implementing Agency` (PSU / Department)
  - `Sanction / Approval Date`
  - `Original Date of Commissioning (DOC)`
  - `Revised Date of Commissioning (DOC)`
  - `Original Cost (₹ Cr)`
  - `Revised Cost (₹ Cr)`
  - `Cumulative Expenditure (₹ Cr)`
  - `Physical Progress (%)`
  - `Delay (Months)`
  - `Milestones Achieved / Pending`
  - `Reasons for Delay` (Land Acquisition, Environmental Clearance, Law & Order, Fund Constraints, Vendor Delay)
- **Coverage**: All active and completed infrastructure projects monitored by MoSPI.
- **Limitations**: Historical reports contain varying reporting frequencies across older years.
- **ML & Analytics Classification**:
  - Temporal ML Training: **YES** (Primary ground truth for historical snapshot panel)
  - Validation & Backtesting: **YES**

---

## Source 3: User-Provided PAIMANA CSV Exports
- **Source Type**: Downloaded CSV / XLSX dataset from PAIMANA portal
- **Reporting Period**: User-specified snapshot month/year
- **Available Fields**: Header auto-detected dynamically by `ml/ingestion/schema_guard.py`
- **Coverage**: Snapshot of active/completed projects at export time.
- **Limitations**: Requires schema normalization before merging with historical panel.
- **ML & Analytics Classification**:
  - Operational Inference & Test Bench: **YES**

---

## Temporal Anti-Leakage Rules (Strict Enforcement)
1. **Fact vs Prediction**: Every record in the database is tagged as `FACT`, `DERIVED`, `MODEL_PREDICTION`, or `EXPLANATION`.
2. **Snapshot Cutoff at Month $M$**: For any historical snapshot dated $M$, features must **ONLY** use data recorded on or before $M$.
3. **Excluded Future Variables at Month $M$**:
   - Future revised costs approved after $M$.
   - Future actual completion dates occurring after $M$.
   - Future physical progress percentages reported after $M$.
