"""
PAIMANA Supabase Automated Data Seeder
Populates projects, warnings, audit_logs, and documents tables on Supabase remote database.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip('"').strip("'").rstrip("/")
SUPABASE_KEY = (os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY") or "").strip('"').strip("'")

SEED_PROJECTS = [
    {
        "project_code": "PAIM-619054",
        "project_name": "Greenfield Expressway Expansion Phase I",
        "sector": "Transport & Logistics",
        "ministry": "Ministry of Road Transport and Highways",
        "state": "Maharashtra",
        "implementing_agency": "NHAI",
        "original_cost": 1162.76,
        "revised_cost": 1390.00,
        "expenditure": 494.72,
        "physical_progress": 42.5,
        "sanction_date": "2024-03-01",
        "original_doc": "2027-12-31",
        "snapshot_date": "2026-01-01",
        "target_final_delay_months": 16.5,
        "target_cost_overrun_pct": 19.5,
        "target_is_high_risk": 1
    },
    {
        "project_code": "PAIM-1042",
        "project_name": "Delhi-Mumbai Expressway Connectivity Spur",
        "sector": "Transport & Logistics",
        "ministry": "Ministry of Road Transport and Highways",
        "state": "Gujarat",
        "implementing_agency": "NHAI",
        "original_cost": 1450.0,
        "revised_cost": 1720.0,
        "expenditure": 890.0,
        "physical_progress": 48.5,
        "sanction_date": "2020-03-15",
        "original_doc": "2023-12-31",
        "snapshot_date": "2022-09-01",
        "target_final_delay_months": 18.0,
        "target_cost_overrun_pct": 22.4,
        "target_is_high_risk": 1
    },
    {
        "project_code": "PAIM-3088",
        "project_name": "Ultra Mega Solar Park & Grid Substation",
        "sector": "Energy",
        "ministry": "Ministry of Power",
        "state": "Rajasthan",
        "implementing_agency": "NTPC",
        "original_cost": 2100.0,
        "revised_cost": 2350.0,
        "expenditure": 1420.0,
        "physical_progress": 68.0,
        "sanction_date": "2021-06-10",
        "original_doc": "2025-06-30",
        "snapshot_date": "2024-01-15",
        "target_final_delay_months": 8.5,
        "target_cost_overrun_pct": 11.9,
        "target_is_high_risk": 0
    },
    {
        "project_code": "PAIM-5012",
        "project_name": "Dedicated Freight Corridor East Phase III",
        "sector": "Transport & Logistics",
        "ministry": "Ministry of Railways",
        "state": "Uttar Pradesh",
        "implementing_agency": "DFCCIL",
        "original_cost": 4800.0,
        "revised_cost": 5950.0,
        "expenditure": 3100.0,
        "physical_progress": 54.0,
        "sanction_date": "2019-11-20",
        "original_doc": "2024-12-31",
        "snapshot_date": "2023-10-01",
        "target_final_delay_months": 24.0,
        "target_cost_overrun_pct": 23.9,
        "target_is_high_risk": 1
    },
    {
        "project_code": "PAIM-2099",
        "project_name": "National Water Grid Pipeline & Treatment",
        "sector": "Water & Sanitation",
        "ministry": "Ministry of Jal Shakti",
        "state": "Madhya Pradesh",
        "implementing_agency": "NJSM",
        "original_cost": 950.0,
        "revised_cost": 980.0,
        "expenditure": 610.0,
        "physical_progress": 72.0,
        "sanction_date": "2022-02-14",
        "original_doc": "2025-12-31",
        "snapshot_date": "2024-05-20",
        "target_final_delay_months": 3.0,
        "target_cost_overrun_pct": 3.1,
        "target_is_high_risk": 0
    }
]

def seed_supabase_rest():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[Supabase Seeder] SUPABASE_URL or SUPABASE_KEY missing in .env.")
        return

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # 1. Seed Projects
    print("[Supabase Seeder] Seeding projects table...")
    url = f"{SUPABASE_URL}/rest/v1/projects"
    res = requests.post(url, json=SEED_PROJECTS, headers=headers)
    if res.status_code in [200, 201]:
        print("  -> Projects table seeded successfully!")
    else:
        print(f"  -> Note on Projects seeding ({res.status_code}): {res.text}")

    # 2. Seed Warnings
    print("[Supabase Seeder] Seeding warnings table...")
    warnings_data = [
        {
            "action_id": "ACT-WARN-9041",
            "project_code": "PAIM-619054",
            "title": "Notice of Milestone Delay & Catch-up Plan Directive",
            "recipient": "Project Director, NHAI Phase I",
            "reason": "Forecast delay 16.5 months and cost escalation >15%",
            "body": "OFFICIAL NOTICE TO EXECUTING AGENCY: Ref PAIM-619054. You are hereby notified of a 16.5 month forecast schedule overrun and 19.5% budget escalation. Pursuant to Clause 44.1, submit a revised Catch-up Schedule within 14 days.",
            "status": "PENDING_HUMAN_APPROVAL",
            "created_at": "2026-09-08T10:00:00Z"
        }
    ]
    url_w = f"{SUPABASE_URL}/rest/v1/warnings"
    res_w = requests.post(url_w, json=warnings_data, headers=headers)
    if res_w.status_code in [200, 201]:
        print("  -> Warnings table seeded successfully!")
    else:
        print(f"  -> Note on Warnings seeding ({res_w.status_code}): {res_w.text}")

    # 3. Seed Audit Logs
    print("[Supabase Seeder] Seeding audit_logs table...")
    audit_data = [
        {
            "id": "AUD-1001",
            "user_email": "officer@mospi.gov.in",
            "action": "SYSTEM_INITIALIZED",
            "resource": "PAIMANA_COCKPIT",
            "timestamp": "2026-09-08T08:00:00Z"
        },
        {
            "id": "AUD-1002",
            "user_email": "officer@mospi.gov.in",
            "action": "MODEL_INFERENCE_RUN",
            "resource": "XGBOOST_RISK_ENGINE",
            "timestamp": "2026-09-08T08:30:00Z"
        }
    ]
    url_a = f"{SUPABASE_URL}/rest/v1/audit_logs"
    res_a = requests.post(url_a, json=audit_data, headers=headers)
    if res_a.status_code in [200, 201]:
        print("  -> Audit logs table seeded successfully!")
    else:
        print(f"  -> Note on Audit logs seeding ({res_a.status_code}): {res_a.text}")

if __name__ == "__main__":
    seed_supabase_rest()
