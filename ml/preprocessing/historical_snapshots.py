"""
PAIMANA Multi-Year Historical Snapshot Panel Generator & Loader
Generates realistic multi-year infrastructure project panels across MoSPI sectors (2018-2026)
strictly adhering to temporal anti-leakage rules.
"""

import os
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

SECTORS = [
    "Railways", "Road Transport & Highways", "Power & Renewable Energy",
    "Petroleum & Natural Gas", "Coal", "Water Resources",
    "Telecommunications", "Urban Infrastructure & Metro"
]

MINISTRIES = [
    "Ministry of Railways", "Ministry of Road Transport and Highways",
    "Ministry of Power", "Ministry of Petroleum and Natural Gas",
    "Ministry of Coal", "Ministry of Jal Shakti",
    "Ministry of Communications", "Ministry of Housing and Urban Affairs"
]

STATES = [
    "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka", "Gujarat",
    "West Bengal", "Rajasthan", "Madhya Pradesh", "Bihar", "Odisha",
    "Assam", "Telangana", "Andhra Pradesh", "Haryana", "Punjab"
]

AGENCIES = [
    "NHAI", "Indian Railways", "NTPC", "ONGC", "Coal India Limited",
    "DMRC", "POWERGRID", "RVNL", "CPWD", "GAIL", "NHPC"
]


def generate_paimana_benchmark_dataset(
    num_projects: int = 400,
    snapshots_per_project: int = 10,
    start_year: int = 2001,
    end_year: int = 2026
) -> pd.DataFrame:
    """
    Generates a realistic temporal panel of infrastructure projects snapshot data
    from start_year (e.g. 2001) to end_year (e.g. 2026). Each project has multiple historical snapshot records.
    """
    np.random.seed(42)
    random.seed(42)

    records = []

    for i in range(1, num_projects + 1):
        p_code = f"PAIM-{1000 + i}"
        p_name = f"Project {p_code} - {np.random.choice(['Expressway', 'Railway Line Electrification', 'Thermal Power Unit', 'Metro Line Phase II', 'Solar Park Development', 'Gas Pipeline Expansion', 'Bridge Construction'])}"
        sector_idx = np.random.randint(0, len(SECTORS))
        sector = SECTORS[sector_idx]
        ministry = MINISTRIES[sector_idx]
        agency = np.random.choice(AGENCIES)
        state = np.random.choice(STATES)

        # Base financial & schedule parameters
        original_cost = round(float(np.random.uniform(150.0, 8500.0)), 2)
        sanction_year = np.random.randint(start_year, max(start_year + 1, end_year - 2))
        sanction_month = np.random.randint(1, 13)
        sanction_date = datetime(sanction_year, sanction_month, 1)

        target_duration_months = int(np.random.uniform(18, 72))
        original_doc = sanction_date + timedelta(days=target_duration_months * 30)

        # Intrinsic risk factors (hidden during snapshot generation, reflected in progress)
        complexity = np.random.choice([1.0, 1.2, 1.5, 1.8], p=[0.4, 0.3, 0.2, 0.1])
        land_acq_delay_risk = np.random.choice([0, 1], p=[0.65, 0.35])
        fund_bottleneck_risk = np.random.choice([0, 1], p=[0.7, 0.3])

        # Actual underlying project trajectory
        actual_delay_factor = (complexity - 1.0) + (0.4 * land_acq_delay_risk) + (0.3 * fund_bottleneck_risk)
        is_delayed_project = actual_delay_factor > 0.3

        actual_final_delay_months = int(target_duration_months * actual_delay_factor * np.random.uniform(0.5, 1.5)) if is_delayed_project else 0
        actual_final_cost_escalation_pct = (actual_delay_factor * np.random.uniform(0.1, 0.45)) if is_delayed_project else round(float(np.random.uniform(-0.02, 0.05)), 3)

        # Generate monthly snapshot series
        start_snapshot_date = sanction_date + timedelta(days=120)

        for s_idx in range(snapshots_per_project):
            snapshot_offset_months = int(6 + s_idx * 8)
            snapshot_date = start_snapshot_date + timedelta(days=snapshot_offset_months * 30)

            if snapshot_date > datetime(2026, 8, 1):
                break

            months_since_sanction = max(1, int((snapshot_date - sanction_date).days / 30.4375))
            pct_time_elapsed = min(1.0, months_since_sanction / target_duration_months)

            # Progress curve with non-linear S-curve characteristics & realistic lag
            if is_delayed_project:
                progress_lag = min(0.4, 0.1 * snapshot_offset_months / 12 * actual_delay_factor)
                physical_progress = max(0.0, min(99.0, (pct_time_elapsed ** 1.3 - progress_lag) * 100))
            else:
                physical_progress = max(0.0, min(100.0, (pct_time_elapsed ** 0.9) * 100))

            physical_progress = round(float(physical_progress), 1)

            # Expenditure reflects progress + potential cost overrun leakage up to snapshot date
            if is_delayed_project and snapshot_offset_months > 12:
                cost_escalation_so_far = actual_final_cost_escalation_pct * min(1.0, snapshot_offset_months / 36)
                curr_revised_cost = round(original_cost * (1.0 + cost_escalation_so_far), 2)
            else:
                curr_revised_cost = original_cost

            financial_progress_pct = max(0.0, min(100.0, physical_progress * np.random.uniform(0.85, 1.15)))
            expenditure = round(min(curr_revised_cost, (financial_progress_pct / 100.0) * curr_revised_cost), 2)

            # Revised DOC as known AT SNAPSHOT DATE M
            if is_delayed_project and snapshot_offset_months > 12:
                revised_doc = original_doc + timedelta(days=int(actual_final_delay_months * 0.7 * 30))
            else:
                revised_doc = original_doc

            # Calculate observed delay AT SNAPSHOT DATE M
            time_overrun_so_far_months = max(0, int((snapshot_date - original_doc).days / 30.4375)) if snapshot_date > original_doc else 0

            records.append({
                "project_code": p_code,
                "project_name": p_name,
                "sector": sector,
                "ministry": ministry,
                "implementing_agency": agency,
                "state": state,
                "original_cost": original_cost,
                "revised_cost": curr_revised_cost,
                "expenditure": expenditure,
                "physical_progress": physical_progress,
                "sanction_date": sanction_date.strftime("%Y-%m-%d"),
                "original_doc": original_doc.strftime("%Y-%m-%d"),
                "revised_doc": revised_doc.strftime("%Y-%m-%d"),
                "snapshot_date": snapshot_date.strftime("%Y-%m-%d"),
                # Ground truth target variables (for model evaluation at future resolution)
                "target_final_delay_months": actual_final_delay_months,
                "target_cost_overrun_pct": round(actual_final_cost_escalation_pct * 100, 2),
                "target_is_high_risk": 1 if (actual_final_delay_months > 6 or actual_final_cost_escalation_pct > 0.15) else 0
            })

    df = pd.DataFrame(records)
    return df


if __name__ == "__main__":
    df = generate_paimana_benchmark_dataset()
    print(f"Generated PAIMANA temporal panel: {df.shape[0]} rows, {df.shape[1]} columns")
    print(df.head())
