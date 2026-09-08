"""
PAIMANA Database Service - Supabase Integration & SQLite Fallback persistence layer.
Supports live Supabase PostgreSQL data operations with automatic schema detection and local persistence.
"""

import os
import json
import sqlite3
import time
from typing import List, Dict, Any, Optional
from datetime import datetime

def load_env_file():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    env_path = os.path.join(base_dir, ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip().strip("'\"")

load_env_file()

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "paimana.db")

def init_sqlite_db():
    """Initializes local SQLite fallback DB if Supabase tables are pending schema creation."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        project_code TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        sector TEXT NOT NULL,
        ministry TEXT NOT NULL,
        state TEXT,
        implementing_agency TEXT,
        original_cost REAL NOT NULL,
        revised_cost REAL NOT NULL,
        expenditure REAL DEFAULT 0,
        physical_progress REAL DEFAULT 0,
        target_final_delay_months REAL DEFAULT 0,
        target_cost_overrun_pct REAL DEFAULT 0,
        target_is_high_risk INTEGER DEFAULT 0,
        updated_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS warnings (
        action_id TEXT PRIMARY KEY,
        project_code TEXT NOT NULL,
        status TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    # Seed holdout projects into SQLite if empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        seed_projects = [
            ("PAIM-619054", "Greenfield Expressway Expansion Phase I", "Transport & Logistics", "Ministry of Road Transport and Highways", "Maharashtra", "NHAI", 1162.76, 1390.00, 494.72, 42.5, 16.5, 19.5, 1),
            ("PAIM-1042", "Delhi-Mumbai Expressway Connectivity Spur", "Transport & Logistics", "Ministry of Road Transport and Highways", "Gujarat", "NHAI", 1450.0, 1720.0, 890.0, 48.5, 18.0, 22.4, 1),
            ("PAIM-3088", "Ultra Mega Solar Park & Grid Substation", "Energy", "Ministry of Power", "Rajasthan", "NTPC", 2100.0, 2350.0, 1420.0, 68.0, 8.5, 11.9, 0),
            ("PAIM-5012", "Dedicated Freight Corridor East Phase III", "Transport & Logistics", "Ministry of Railways", "Uttar Pradesh", "DFCCIL", 4800.0, 5950.0, 3100.0, 54.0, 24.0, 23.9, 1),
            ("PAIM-2099", "National Water Grid Pipeline & Treatment", "Water & Sanitation", "Ministry of Jal Shakti", "Madhya Pradesh", "NJSM", 950.0, 980.0, 610.0, 72.0, 3.0, 3.1, 0)
        ]
        cursor.executemany("""
        INSERT INTO projects (project_code, project_name, sector, ministry, state, implementing_agency, original_cost, revised_cost, expenditure, physical_progress, target_final_delay_months, target_cost_overrun_pct, target_is_high_risk, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, seed_projects)

        seed_warnings = [
            ("ACT-WARN-9041", "PAIM-619054", "PENDING_HUMAN_APPROVAL", "OFFICIAL NOTICE TO EXECUTING AGENCY: Ref PAIM-619054. You are hereby notified of a 16.5 month forecast schedule overrun and 19.5% budget escalation. Pursuant to Clause 44.1, submit a revised Catch-up Schedule within 14 days.", datetime.utcnow().isoformat())
        ]
        cursor.executemany("INSERT INTO warnings VALUES (?, ?, ?, ?, ?)", seed_warnings)

        seed_audits = [
            ("AUD-1001", "officer@mospi.gov.in", "SYSTEM_INITIALIZED", "PAIMANA_COCKPIT", datetime.utcnow().isoformat()),
            ("AUD-1002", "officer@mospi.gov.in", "MODEL_INFERENCE_RUN", "XGBOOST_RISK_ENGINE", datetime.utcnow().isoformat())
        ]
        cursor.executemany("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?)", seed_audits)

    conn.commit()
    conn.close()

init_sqlite_db()

class DatabaseService:
    def __init__(self):
        load_env_file()
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY", "")
        self.client = None

        if self.supabase_url and self.supabase_key:
            try:
                from supabase import create_client
                self.client = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                print(f"[!] Supabase client init warning: {e}")

    def get_status(self) -> Dict[str, Any]:
        """Returns database status & table counts."""
        is_supabase_connected = False
        supabase_tables = 0
        
        if self.client:
            try:
                res = self.client.table("projects").select("project_code").execute()
                is_supabase_connected = True
                supabase_tables = len(res.data) if hasattr(res, 'data') else 0
            except Exception:
                is_supabase_connected = False

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM projects")
        local_count = cursor.fetchone()[0]
        conn.close()

        return {
            "supabase_configured": bool(self.supabase_url and self.supabase_key),
            "supabase_url": self.supabase_url,
            "supabase_live_connected": is_supabase_connected,
            "supabase_record_count": supabase_tables,
            "local_sqlite_records": local_count,
            "schema_sql_path": "docs/database/schema.sql"
        }

    def get_projects(self) -> List[Dict[str, Any]]:
        """Fetches project portfolio from Supabase or fallback SQLite DB."""
        if self.client:
            try:
                res = self.client.table("projects").select("*").execute()
                if hasattr(res, 'data') and res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[!] Supabase projects query fallback to local DB: {e}")

        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects ORDER BY target_is_high_risk DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows

    def get_warnings(self) -> List[Dict[str, Any]]:
        """Fetches active warning notices."""
        if self.client:
            try:
                res = self.client.table("warnings").select("*").execute()
                if hasattr(res, 'data') and res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[!] Supabase warnings query fallback: {e}")

        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM warnings ORDER BY created_at DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows

    def get_audit_logs(self) -> List[Dict[str, Any]]:
        """Fetches governance audit logs."""
        if self.client:
            try:
                res = self.client.table("audit_logs").select("*").execute()
                if hasattr(res, 'data') and res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[!] Supabase audit logs query fallback: {e}")

        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows

    def record_audit_event(self, user: str, action: str, resource: str):
        """Records an audit event in Supabase and SQLite."""
        evt_id = f"AUD-{int(time.time() * 1000) % 100000}"
        now_iso = datetime.utcnow().isoformat()

        if self.client:
            try:
                self.client.table("audit_logs").insert({"id": evt_id, "user": user, "action": action, "resource": resource, "timestamp": now_iso}).execute()
            except Exception as e:
                print(f"[!] Supabase audit insert fallback: {e}")

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?)", (evt_id, user, action, resource, now_iso))
        conn.commit()
        conn.close()

GLOBAL_DB = DatabaseService()
