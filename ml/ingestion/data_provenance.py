"""
PAIMANA Data Provenance & Evidence Categorization Module
Enforces strict tagging of every data point across the 5 evidence tiers:
  1. OBSERVED      - Ground truth facts reported by MoSPI/IPMD
  2. DERIVED       - Computed mathematical ratios (S-curves, burn rate, progress lag)
  3. PREDICTED     - Machine learning model outputs (delay, cost overrun, risk score)
  4. AI_INTERPRETED - SHAP/LLM-generated root-cause explanations
  5. RECOMMENDED   - Decision-support action recommendations
"""

import os
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np


class EvidenceCategory:
    OBSERVED = "OBSERVED"
    DERIVED = "DERIVED"
    PREDICTED = "PREDICTED"
    AI_INTERPRETED = "AI_INTERPRETED"
    RECOMMENDED = "RECOMMENDED"


class DataProvenanceTracker:
    """Tracks dataset lineage, checksums, data quality scores, and evidence categories."""

    def __init__(self, dataset_id: str, source: str):
        self.dataset_id = dataset_id
        self.source = source
        self.import_timestamp = datetime.now().isoformat()

    def generate_provenance_metadata(self, df: pd.DataFrame, source_filename: str) -> Dict[str, Any]:
        """Calculates dataset checksum, row/col stats, data quality score, and evidence breakdown."""
        # Calculate SHA256 checksum of raw bytes
        df_bytes = df.to_csv(index=False).encode('utf-8')
        checksum = hashlib.sha256(df_bytes).hexdigest()
        schema_hash = hashlib.sha256(",".join(list(df.columns)).encode('utf-8')).hexdigest()

        # Quality metrics
        row_count = len(df)
        col_count = len(df.columns)
        null_count = int(df.isnull().sum().sum())
        total_cells = max(1, row_count * col_count)
        missingness_pct = round((null_count / total_cells) * 100.0, 2)
        duplicate_count = int(df.duplicated().sum())

        # Quality score calculation (0 to 100)
        quality_score = max(0.0, round(100.0 - (missingness_pct * 1.5) - (duplicate_count / max(1, row_count) * 20.0), 1))

        metadata = {
            "dataset_id": self.dataset_id,
            "source": self.source,
            "source_filename": source_filename,
            "import_timestamp": self.import_timestamp,
            "checksum_sha256": checksum,
            "schema_hash": schema_hash,
            "row_count": row_count,
            "column_count": col_count,
            "null_count": null_count,
            "missingness_percentage": missingness_pct,
            "duplicate_count": duplicate_count,
            "quality_score": quality_score,
            "provenance_status": "VERIFIED_FACTUAL" if quality_score >= 80 else "NEEDS_REVIEW"
        }
        return metadata

    @staticmethod
    def tag_record_evidence(record: Dict[str, Any]) -> Dict[str, Any]:
        """Tags every key in a project record with its exact evidence category."""
        tagged_record = {}
        observed_fields = {"project_code", "project_name", "sector", "ministry", "implementing_agency", "state", "original_cost", "sanction_date", "snapshot_date"}
        derived_fields = {"revised_cost", "expenditure", "physical_progress", "expected_progress_pct", "progress_lag_pct", "expenditure_burn_rate", "financial_physical_gap", "cost_escalation_ratio"}
        predicted_fields = {"target_final_delay_months", "target_cost_overrun_pct", "predicted_delay_months", "predicted_cost_overrun_pct", "target_is_high_risk", "risk_score"}

        for key, value in record.items():
            if key in observed_fields:
                category = EvidenceCategory.OBSERVED
            elif key in derived_fields:
                category = EvidenceCategory.DERIVED
            elif key in predicted_fields:
                category = EvidenceCategory.PREDICTED
            elif "explanation" in key or "reason" in key:
                category = EvidenceCategory.AI_INTERPRETED
            elif "recommendation" in key or "action" in key:
                category = EvidenceCategory.RECOMMENDED
            else:
                category = EvidenceCategory.OBSERVED

            tagged_record[key] = {
                "value": value,
                "evidence_category": category
            }
        return tagged_record


if __name__ == "__main__":
    # Self test
    tracker = DataProvenanceTracker("DATASET-MOSPI-2026", "Official MoSPI Flash Reports")
    sample_df = pd.DataFrame({
        "project_code": ["PAIM-619054"],
        "original_cost": [1162.76],
        "physical_progress": [42.5]
    })
    meta = tracker.generate_provenance_metadata(sample_df, "paimana_real_2026_01.csv")
    print("Dataset Provenance Metadata:\n", json.dumps(meta, indent=2))
