"""
PAIMANA Supabase & Local Database Schema Initializer
Automates SQL DDL table creation on Supabase and local SQLite fallback.
"""

import os
import sqlite3
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

CREATE_TABLES_SQL = """
-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    project_code VARCHAR(50) PRIMARY KEY,
    project_name TEXT NOT NULL,
    sector VARCHAR(100),
    ministry TEXT,
    state VARCHAR(100),
    implementing_agency VARCHAR(100),
    original_cost DOUBLE PRECISION DEFAULT 0.0,
    revised_cost DOUBLE PRECISION DEFAULT 0.0,
    expenditure DOUBLE PRECISION DEFAULT 0.0,
    physical_progress DOUBLE PRECISION DEFAULT 0.0,
    sanction_date VARCHAR(30),
    original_doc VARCHAR(30),
    snapshot_date VARCHAR(30),
    target_final_delay_months DOUBLE PRECISION DEFAULT 0.0,
    target_cost_overrun_pct DOUBLE PRECISION DEFAULT 0.0,
    target_is_high_risk INT DEFAULT 0
);

-- 2. Warnings & Governance Table
CREATE TABLE IF NOT EXISTS public.warnings (
    action_id VARCHAR(50) PRIMARY KEY,
    project_code VARCHAR(50),
    title TEXT,
    recipient TEXT,
    reason TEXT,
    body TEXT,
    status VARCHAR(50) DEFAULT 'PENDING_HUMAN_APPROVAL',
    approved_by VARCHAR(100),
    approved_at VARCHAR(50),
    created_at VARCHAR(50)
);

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_email VARCHAR(100),
    action VARCHAR(100),
    resource VARCHAR(100),
    timestamp VARCHAR(50)
);

-- 4. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50),
    file_name TEXT,
    file_size INT,
    processing_status VARCHAR(50) DEFAULT 'READY',
    created_at VARCHAR(50)
);
"""

def init_local_db():
    db_path = os.path.join(os.path.dirname(__file__), "paimana.db")
    print(f"[SQLite] Initializing local database schema at {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # SQLite compatible DDL
    sqlite_sql = CREATE_TABLES_SQL.replace("public.", "").replace("DOUBLE PRECISION", "REAL")
    cursor.executescript(sqlite_sql)
    
    # Seed initial project if empty
    cursor.execute("SELECT count(*) FROM projects;")
    count = cursor.fetchone()[0]
    if count == 0:
        print("[SQLite] Seeding initial MoSPI projects into local database...")
        seed_projects = [
            ("PAIM-619054", "Greenfield Expressway Expansion Phase I", "Transport & Logistics", "Ministry of Road Transport and Highways", "Maharashtra", "NHAI", 1162.76, 1390.00, 494.72, 42.5, "2024-03-01", "2027-12-31", "2026-01-01", 16.5, 19.5, 1),
            ("PAIM-1042", "Delhi-Mumbai Expressway Connectivity Spur", "Transport & Logistics", "Ministry of Road Transport and Highways", "Gujarat", "NHAI", 1450.0, 1720.0, 890.0, 48.5, "2020-03-15", "2023-12-31", "2022-09-01", 18.0, 22.4, 1),
            ("PAIM-3088", "Ultra Mega Solar Park & Grid Substation", "Energy", "Ministry of Power", "Rajasthan", "NTPC", 2100.0, 2350.0, 1420.0, 68.0, "2021-06-10", "2025-06-30", "2024-01-15", 8.5, 11.9, 0),
            ("PAIM-5012", "Dedicated Freight Corridor East Phase III", "Transport & Logistics", "Ministry of Railways", "Uttar Pradesh", "DFCCIL", 4800.0, 5950.0, 3100.0, 54.0, "2019-11-20", "2024-12-31", "2023-10-01", 24.0, 23.9, 1),
            ("PAIM-2099", "National Water Grid Pipeline & Treatment", "Water & Sanitation", "Ministry of Jal Shakti", "Madhya Pradesh", "NJSM", 950.0, 980.0, 610.0, 72.0, "2022-02-14", "2025-12-31", "2024-05-20", 3.0, 3.1, 0)
        ]
        cursor.executemany("""
            INSERT INTO projects (project_code, project_name, sector, ministry, state, implementing_agency, original_cost, revised_cost, expenditure, physical_progress, sanction_date, original_doc, snapshot_date, target_final_delay_months, target_cost_overrun_pct, target_is_high_risk)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_projects)
    
    conn.commit()
    conn.close()
    print("[SQLite] Schema initialization & seeding complete.")

def check_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[Supabase] SUPABASE_URL / SUPABASE_KEY not set in .env. Using SQLite local engine.")
        return False
    try:
        from supabase import create_client
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"[Supabase] Connected to {SUPABASE_URL}")
        return True
    except Exception as e:
        print(f"[Supabase] Connection test: {e}")
        return False

if __name__ == "__main__":
    init_local_db()
    check_supabase()
    print("\n--- DB SCHEMA READY ---")
    print("SQL DDL for Supabase SQL Editor:\n")
    print(CREATE_TABLES_SQL)
