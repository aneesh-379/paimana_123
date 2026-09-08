"""
PAIMANA Pydantic API Schemas
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ProjectInputSchema(BaseModel):
    project_code: str = "PAIM-1001"
    project_name: str = "Sample Infrastructure Project"
    sector: str = "Road Transport & Highways"
    ministry: str = "Ministry of Road Transport and Highways"
    state: str = "Maharashtra"
    implementing_agency: Optional[str] = "NHAI"
    original_cost: float = 500.0
    revised_cost: float = 550.0
    expenditure: float = 250.0
    physical_progress: float = 40.0
    sanction_date: str = "2021-01-01"
    original_doc: str = "2024-01-01"
    snapshot_date: Optional[str] = "2023-01-01"


class PredictionResultSchema(BaseModel):
    project_code: str
    project_name: str
    sector: str
    ministry: str
    state: str
    original_cost: float
    revised_cost: float
    expenditure: float
    physical_progress: float
    predicted_delay_months: float
    predicted_cost_overrun_pct: float
    predicted_additional_cost_cr: float
    risk_score: float
    risk_tier: str
    target_final_delay_months: Optional[float] = None
    target_cost_overrun_pct: Optional[float] = None


class ExplanationSchema(BaseModel):
    project_code: str
    predicted_delay_months: float
    predicted_cost_overrun_pct: float
    risk_score: float
    risk_tier: str
    feature_contributions: List[Dict[str, Any]]
    interventions: List[str]


class IngestionResponseSchema(BaseModel):
    message: str
    rows_processed: int
    data_quality_report: Dict[str, Any]
