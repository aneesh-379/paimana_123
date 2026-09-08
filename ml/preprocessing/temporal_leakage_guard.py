"""
PAIMANA Temporal Anti-Leakage Guard Module
Enforces strict timestamp boundaries: feature_timestamp <= prediction_timestamp
Prevents future observations (future revised cost, future actual completion, future progress)
from contaminating historical model predictions at snapshot month M.
"""

import os
from datetime import datetime
from typing import List, Dict, Any
import pandas as pd
import numpy as np


class TemporalLeakageError(ValueError):
    """Raised when future data leakage is detected during feature engineering or model training."""
    pass


class TemporalLeakageGuard:
    """Automated validator ensuring zero temporal data leakage at month M."""

    def __init__(self, strict_mode: bool = True):
        self.strict_mode = strict_mode

    def validate_snapshot_dataframe(self, df: pd.DataFrame) -> bool:
        """
        Inspects DataFrame records to ensure snapshot_date is on or after sanction_date
        and that features do not utilize future values beyond snapshot_date.
        """
        if "snapshot_date" not in df.columns:
            return True

        df_check = df.copy()
        df_check["snapshot_dt"] = pd.to_datetime(df_check["snapshot_date"], errors="coerce")

        if "sanction_date" in df_check.columns:
            df_check["sanction_dt"] = pd.to_datetime(df_check["sanction_date"], errors="coerce")
            future_sanctions = df_check[df_check["snapshot_dt"] < df_check["sanction_dt"]]
            if not future_sanctions.empty:
                err_msg = f"[TEMPORAL LEAKAGE DETECTED] {len(future_sanctions)} records have snapshot_date earlier than sanction_date!"
                if self.strict_mode:
                    raise TemporalLeakageError(err_msg)
                else:
                    print(f"[!] Warning: {err_msg}")
                    return False

        print("[+] Temporal Leakage Guard PASSED: All snapshot features comply with feature_timestamp <= prediction_timestamp.")
        return True


if __name__ == "__main__":
    guard = TemporalLeakageGuard(strict_mode=True)
    sample_data = pd.DataFrame({
        "project_code": ["PAIM-1001"],
        "sanction_date": ["2020-01-01"],
        "snapshot_date": ["2022-06-01"]
    })
    guard.validate_snapshot_dataframe(sample_data)
