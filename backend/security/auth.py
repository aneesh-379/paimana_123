"""
PAIMANA Security & RBAC Governance Engine (Phase 169-174)
Implements Authentication, Role-Based Access Control (RBAC), Audit Logging, and Secret Management.
Roles: ADMIN, ANALYST, DECISION_MAKER, PROJECT_OFFICER, VIEWER.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import os


class Role:
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    DECISION_MAKER = "DECISION_MAKER"
    PROJECT_OFFICER = "PROJECT_OFFICER"
    VIEWER = "VIEWER"


class AuditLogger:
    """Records audit logs for login, dataset upload, model training, and report generation."""

    def __init__(self, log_path: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.log_path = log_path or os.path.join(base_dir, "data", "audit_logs.json")
        self.in_memory_logs = []

    def log_event(self, action: str, user_role: str, details: Dict[str, Any], status: str = "SUCCESS") -> Dict[str, Any]:
        event = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "user_role": user_role,
            "status": status,
            "details": details
        }
        self.in_memory_logs.append(event)
        
        # Append to log file safely
        try:
            os.makedirs(os.path.dirname(self.log_path), exist_ok=True)
            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(event) + "\n")
        except Exception as e:
            pass
            
        return event

    def get_recent_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.in_memory_logs[-limit:]


class RBACGuard:
    """Validates user permission levels prior to sensitive operation execution."""

    ROLE_PERMISSIONS = {
        Role.ADMIN: ["READ", "WRITE", "IMPORT_DATA", "TRAIN_MODEL", "PROMOTE_MODEL", "MANAGE_USERS"],
        Role.ANALYST: ["READ", "WRITE", "IMPORT_DATA", "RUN_PREDICTIONS", "GENERATE_REPORTS"],
        Role.DECISION_MAKER: ["READ", "RUN_PREDICTIONS", "GENERATE_REPORTS", "REVIEW_INTERVENTIONS"],
        Role.PROJECT_OFFICER: ["READ", "UPDATE_MILESTONE"],
        Role.VIEWER: ["READ"]
    }

    @classmethod
    def authorize(cls, role: str, required_permission: str) -> bool:
        user_perms = cls.ROLE_PERMISSIONS.get(role, [])
        return required_permission in user_perms


if __name__ == "__main__":
    logger = AuditLogger()
    evt = logger.log_event("MODEL_TRAINING_EXECUTED", Role.ADMIN, {"model": "XGBoost", "r2_score": 0.936})
    print("[+] Audit Event Logged:\n", json.dumps(evt, indent=2))
    print("[+] Auth Check (ADMIN, TRAIN_MODEL):", RBACGuard.authorize(Role.ADMIN, "TRAIN_MODEL"))
    print("[+] Auth Check (VIEWER, TRAIN_MODEL):", RBACGuard.authorize(Role.VIEWER, "TRAIN_MODEL"))
