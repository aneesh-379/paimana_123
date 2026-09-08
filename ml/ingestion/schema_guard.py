"""
PAIMANA Schema Guard Engine
Inspects incoming raw CSV headers dynamically without hardcoding assumptions.
Maps raw column names to normalized internal fields and records missing fields.
"""

from typing import Dict, List, Tuple, Any, Optional
import pandas as pd
import numpy as np

# Standardized internal field mappings based on official PAIMANA schema
KNOWN_HEADER_SYNONYMS = {
    "project_code": ["project code", "project_code", "project id", "proj_code", "code", "id"],
    "project_name": ["project name", "project_name", "proj_name", "name of project", "name"],
    "sector": ["sector", "sector name", "sector_name", "industry"],
    "ministry": ["line ministry", "ministry", "ministry/department", "ministry / department", "dept", "department"],
    "implementing_agency": ["implementing agency", "agency", "executing agency", "psu", "implementing_agency"],
    "state": ["state", "state/ut", "state / ut", "location", "state_ut"],
    "original_cost": ["original cost", "original approved cost", "original cost (cr.)", "original_cost", "approved_cost", "cost_original"],
    "revised_cost": ["revised cost", "latest revised cost", "revised cost (cr.)", "revised_cost", "cost_revised", "latest_cost"],
    "expenditure": ["cumulative expenditure", "expenditure", "expenditure (cr.)", "expenditure (cr)", "cumulative_expenditure", "total_expenditure"],
    "physical_progress": ["physical progress", "physical progress (%)", "physical progress %", "physical_progress", "progress_pct", "progress"],
    "sanction_date": ["sanction date", "sanction / approval date", "approval date", "sanction_date", "date_of_sanction"],
    "original_doc": ["original date of commissioning", "original doc", "original end date", "original target date", "original_doc", "original_completion_date"],
    "revised_doc": ["revised date of commissioning", "revised doc", "revised end date", "revised target date", "revised_doc", "revised_completion_date"],
    "actual_doc": ["actual completion date", "actual doc", "actual_doc", "completion_date"],
    "snapshot_date": ["snapshot date", "reporting date", "month & year", "month_year", "snapshot_date", "report_month"]
}


class SchemaGuard:
    """Dynamic schema validator and normalizer for PAIMANA CSV datasets."""

    def __init__(self, synonym_map: Optional[Dict[str, List[str]]] = None):
        self.synonym_map = synonym_map or KNOWN_HEADER_SYNONYMS

    def inspect_and_normalize(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Inspects DataFrame headers, maps them to normalized internal names,
        and returns the normalized DataFrame along with a Data Quality & Mapping Report.
        """
        raw_headers = list(df.columns)
        normalized_map: Dict[str, str] = {}
        unmapped_raw_headers: List[str] = []
        mapped_internal_fields: List[str] = []

        # Lowercase and clean raw header strings for matching
        clean_raw_headers = {col: col.strip().lower() for col in raw_headers}

        for internal_key, synonyms in self.synonym_map.items():
            found = False
            for raw_col, clean_col in clean_raw_headers.items():
                if clean_col in synonyms:
                    normalized_map[raw_col] = internal_key
                    mapped_internal_fields.append(internal_key)
                    found = True
                    break
            if not found:
                # Partial match fallback (e.g., header contains 'cost' or 'expenditure')
                for raw_col, clean_col in clean_raw_headers.items():
                    if raw_col not in normalized_map:
                        if any(syn in clean_col for syn in synonyms if len(syn) > 3):
                            normalized_map[raw_col] = internal_key
                            mapped_internal_fields.append(internal_key)
                            found = True
                            break

        for col in raw_headers:
            if col not in normalized_map:
                unmapped_raw_headers.append(col)

        # Build normalized dataframe
        norm_df = df.rename(columns=normalized_map)

        # Identify missing core fields
        all_core_fields = list(self.synonym_map.keys())
        missing_core_fields = [f for f in all_core_fields if f not in norm_df.columns]

        report = {
            "total_raw_columns": len(raw_headers),
            "mapped_fields_count": len(mapped_internal_fields),
            "unmapped_raw_headers": unmapped_raw_headers,
            "missing_core_fields": missing_core_fields,
            "field_status": {
                f: ("FACT" if f in norm_df.columns else "UNAVAILABLE") for f in all_core_fields
            },
            "mapping_details": normalized_map
        }

        return norm_df, report


if __name__ == "__main__":
    # Smoke test
    sample_data = pd.DataFrame({
        "Project Code": ["P101", "P102"],
        "Name of Project": ["Highway Expansion", "Metro Line 3"],
        "Sector": ["Road Transport", "Railways"],
        "Line Ministry": ["MoRTH", "MoHUA"],
        "Original Approved Cost": [450.0, 1200.0],
        "Latest Revised Cost": [520.0, 1450.0],
        "Cumulative Expenditure": [310.0, 800.0],
        "Physical Progress (%)": [65.0, 50.0],
        "State / UT": ["Maharashtra", "Delhi"]
    })

    guard = SchemaGuard()
    norm_df, report = guard.inspect_and_normalize(sample_data)
    print("Mapped fields:", report["mapped_fields_count"])
    print("Missing core fields:", report["missing_core_fields"])
    print(norm_df.head())
