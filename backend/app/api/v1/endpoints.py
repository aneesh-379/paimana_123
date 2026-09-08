"""
PAIMANA API Router Endpoints
"""

import os
import json
import pandas as pd
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File

from backend.app.config import settings
from backend.app.schemas.project import (
    ProjectInputSchema,
    PredictionResultSchema,
    ExplanationSchema,
    IngestionResponseSchema
)
from backend.app.services.risk_engine import risk_engine
from ml.ingestion.schema_guard import SchemaGuard

router = APIRouter()


@router.get("/health", tags=["System"])
def health_check():
    """Health check endpoint for platform monitor."""
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "models_loaded": risk_engine.model_delay is not None
    }


@router.get("/holdout", tags=["Test Bench"])
def get_user_holdout_dataset():
    """
    Returns the 10% held-out user test dataset specifically generated for manual testing and verification.
    """
    holdout_json_path = os.path.join(settings.PROCESSED_DIR, "user_test_holdout.json")
    holdout_csv_path = os.path.join(settings.PROCESSED_DIR, "user_test_holdout.csv")

    if os.path.exists(holdout_json_path):
        with open(holdout_json_path, "r") as f:
            records = json.load(f)
        return {
            "total_records": len(records),
            "source": "10% Held-Out User Test Set",
            "projects": records
        }
    elif os.path.exists(holdout_csv_path):
        df = pd.read_csv(holdout_csv_path)
        records = df.to_dict(orient="records")
        return {
            "total_records": len(records),
            "source": "10% Held-Out User Test Set",
            "projects": records
        }
    else:
        # Fallback benchmark generator if not trained yet
        from ml.preprocessing.historical_snapshots import generate_paimana_benchmark_dataset
        df = generate_paimana_benchmark_dataset(num_projects=15, snapshots_per_project=1)
        records = df.to_dict(orient="records")
        return {
            "total_records": len(records),
            "source": "Dynamic Generated Benchmark",
            "projects": records
        }


@router.get("/projects", response_model=List[PredictionResultSchema], tags=["Projects"])
def get_monitored_projects(limit: int = 50):
    """
    Returns active monitored infrastructure projects with predictive risk scoring.
    """
    holdout_csv_path = os.path.join(settings.PROCESSED_DIR, "user_test_holdout.csv")
    if os.path.exists(holdout_csv_path):
        df = pd.read_csv(holdout_csv_path)
    else:
        from ml.preprocessing.historical_snapshots import generate_paimana_benchmark_dataset
        df = generate_paimana_benchmark_dataset(num_projects=limit, snapshots_per_project=1)

    records = df.head(limit).to_dict(orient="records")
    results = [risk_engine.predict_project(rec) for rec in records]
    return results


@router.post("/predict", response_model=PredictionResultSchema, tags=["Predictive AI"])
def predict_project_risk(project: ProjectInputSchema):
    """
    Predicts schedule delay (months), cost overrun (%), and risk tier for a project.
    """
    input_dict = project.model_dump()
    return risk_engine.predict_project(input_dict)


@router.post("/explain", response_model=ExplanationSchema, tags=["Explainability"])
def explain_project_risk(project: ProjectInputSchema):
    """
    Generates SHAP feature-level breakdown and evidence-based interventions for a project.
    """
    input_dict = project.model_dump()
    return risk_engine.explain_project(input_dict)


@router.post("/ingest", response_model=IngestionResponseSchema, tags=["Data Pipeline"])
async def ingest_paimana_csv(file: UploadFile = File(...)):
    """
    Uploads raw PAIMANA CSV, inspects headers dynamically using SchemaGuard, and normalizes schema.
    """
    try:
        df_raw = pd.read_csv(file.file)
        guard = SchemaGuard()
        norm_df, report = guard.inspect_and_normalize(df_raw)

        # Save to processed directory
        output_path = os.path.join(settings.PROCESSED_DIR, "user_ingested_normalized.csv")
        norm_df.to_csv(output_path, index=False)

        return {
            "message": f"Successfully ingested and normalized file {file.filename}",
            "rows_processed": len(norm_df),
            "data_quality_report": report
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")
