"""
PAIMANA Supabase Automated Data Seeder
Populates projects, warnings, audit_logs, and documents tables on Supabase remote database.
"""

import os
import requests
import pandas as pd
import numpy as np
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

def safe_float(val, default=0.0):
    try:
        if pd.isna(val):
            return default
        f = float(val)
        return default if np.isnan(f) or np.isinf(f) else f
    except:
        return default

def safe_str(val, default="Unknown"):
    if pd.isna(val) or val is None or str(val).lower() in ['nan', 'none', 'unknown']:
        return default
    return str(val).strip()

def seed_real_mospi_dataset(max_records=100):
    """Loads and seeds real infrastructure projects from traindata.csv / Testdata.csv."""
    import pandas as pd
    import numpy as np
    dataset_path = "data/processed/traindata.csv"
    if not os.path.exists(dataset_path):
        dataset_path = "data/processed/Testdata.csv"
    if not os.path.exists(dataset_path):
        dataset_path = "traindata.csv"

    if not os.path.exists(dataset_path):
        print(f"[Supabase Seeder] Dataset not found at {dataset_path}")
        return

    print(f"[Supabase Seeder] Loading real records from {dataset_path}...")
    df = pd.read_csv(dataset_path, low_memory=False).head(max_records)

    records = []
    for idx, row in df.iterrows():
        pid = row.get('Project_ID', row.get('project_code', 1000 + idx))
        p_code = f"PAIM-{pid}" if not str(pid).startswith("PAIM-") else str(pid)
        
        orig_c = safe_float(row.get('Original_Cost_Crore', row.get('original_cost', 0.0)))
        rev_c = safe_float(row.get('Revised_Cost_Crore', row.get('revised_cost', row.get('anticipated_cost', orig_c))), orig_c)
        exp = safe_float(row.get('Cumulative_Expenditure_Crore', row.get('cumulative_expenditure', row.get('expenditure', 0.0))))
        phys = safe_float(row.get('Physical_Progress_Percent', row.get('physical_progress', 0.0)))
        
        delay = safe_float(row.get('delay', row.get('target_delay', 0.0)))
        overrun = max(0.0, rev_c - orig_c)
        overrun_pct = round((overrun / orig_c * 100) if orig_c > 0 else 0.0, 2)
        is_high = 1 if (delay >= 12 or overrun_pct >= 20.0) else 0

        p_name = safe_str(row.get('Project_Name', row.get('project_name')), f"Infrastructure Project {p_code}")
        sector = safe_str(row.get('Sector', row.get('sector')), "Road Transport and Highways")
        ministry = safe_str(row.get('Ministry', row.get('ministry')), "Ministry of Road Transport and Highways")
        state = safe_str(row.get('State', row.get('state')), "All India")
        agency = safe_str(row.get('Agency', row.get('implementing_agency')), "NHAI")

        records.append({
            "project_code": p_code,
            "project_name": p_name,
            "sector": sector,
            "ministry": ministry,
            "state": state,
            "implementing_agency": agency,
            "original_cost": orig_c,
            "revised_cost": rev_c,
            "expenditure": exp,
            "physical_progress": phys,
            "sanction_date": safe_str(row.get('Approval_Date', row.get('sanction_date')), "2021-01-01"),
            "original_doc": safe_str(row.get('Original_Target_Date', row.get('original_doc')), "2024-01-01"),
            "snapshot_date": safe_str(row.get('Revised_Target_Date', row.get('snapshot_date')), "2026-01-01"),
            "target_final_delay_months": delay,
            "target_cost_overrun_pct": overrun_pct,
            "target_is_high_risk": is_high
        })

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    print(f"[Supabase Seeder] Batch inserting {len(records)} projects into Supabase...")
    chunk_size = 50
    for i in range(0, len(records), chunk_size):
        chunk = records[i:i+chunk_size]
        url = f"{SUPABASE_URL}/rest/v1/projects"
        res = requests.post(url, json=chunk, headers=headers)
        if res.status_code in [200, 201]:
            print(f"  -> Batch {i//chunk_size + 1} ({len(chunk)} items) inserted.")
        else:
            print(f"  -> Batch {i//chunk_size + 1} response ({res.status_code}): {res.text[:100]}")

if __name__ == "__main__":
    seed_supabase_rest()
    seed_real_mospi_dataset(max_records=100)
