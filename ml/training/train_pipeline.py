"""
PAIMANA ML Training Pipeline
Trains XGBoost / RandomForest predictive models for Schedule Delay and Cost Overrun.
Implements 80% Train, 10% Test Evaluation, and 10% Held-Out User Test Set split.
Saves model artifacts and exports holdout test data for manual verification.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, classification_report

from ml.preprocessing.historical_snapshots import generate_paimana_benchmark_dataset
from ml.features.engineer_features import PAIMANAFeatureEngineer, FEATURE_COLUMNS


def run_training_pipeline(
    data_dir: str = "data",
    num_projects: int = 300,
    snapshots_per_project: int = 5,
    random_state: int = 42
):
    """
    Executes complete data generation, feature engineering, 80/10/10 train/eval/holdout split,
    model training, metric evaluation, and artifact export.
    """
    print("=" * 60)
    print("PAIMANA AI - ML TRAINING PIPELINE INITIALIZING")
    print("=" * 60)

    # Step 1: Generate / Load Dataset
    processed_dir = os.path.join(data_dir, "processed")
    models_dir = os.path.join(data_dir, "models")
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)

    archive_2001_2026_path = os.path.join(processed_dir, "paimana_2001_2026_archive_snapshots.csv")
    if os.path.exists(archive_2001_2026_path):
        print(f"[*] Loading existing 2001-2026 multi-year PAIMANA archive panel from {archive_2001_2026_path}...")
        df_raw = pd.read_csv(archive_2001_2026_path)
    else:
        print(f"[*] Generating PAIMANA 2001-2026 multi-year panel ({num_projects} projects, {snapshots_per_project} snapshots each)...")
        df_raw = generate_paimana_benchmark_dataset(num_projects=num_projects, snapshots_per_project=snapshots_per_project, start_year=2001, end_year=2026)
        df_raw.to_csv(archive_2001_2026_path, index=False)

    print(f"Raw Panel Shape: {df_raw.shape[0]} rows, {df_raw.shape[1]} columns")
    df_raw.to_csv(os.path.join(processed_dir, "paimana_benchmark_snapshots.csv"), index=False)

    # Step 2: Feature Engineering
    print("Executing feature engineering and time-aware risk ratio calculations...")
    fe = PAIMANAFeatureEngineer()
    df_transformed, feature_cols = fe.fit_transform(df_raw)

    # Save feature engineer dictionary
    joblib.dump(fe, os.path.join(models_dir, "feature_engineer.joblib"))

    X = df_transformed[feature_cols]
    y_delay = df_transformed["target_final_delay_months"]
    y_cost_pct = df_transformed["target_cost_overrun_pct"]
    y_risk = df_transformed["target_is_high_risk"]

    # Step 3: Train / Test / Holdout Split (80% Train, 10% Test Eval, 10% User Holdout)
    print("\nSplitting Dataset: 80% Train | 10% Test Eval | 10% Held-Out User Test Set...")

    # First split: 80% Train, 20% Total Test
    X_train, X_temp, y_delay_train, y_delay_temp, y_cost_train, y_cost_temp, y_risk_train, y_risk_temp, df_train, df_temp = train_test_split(
        X, y_delay, y_cost_pct, y_risk, df_raw, test_size=0.20, random_state=random_state
    )

    # Second split: 50% of the 20% test = 10% Eval, 10% User Holdout
    X_eval, X_holdout, y_delay_eval, y_delay_holdout, y_cost_eval, y_cost_holdout, y_risk_eval, y_risk_holdout, df_eval, df_holdout = train_test_split(
        X_temp, y_delay_temp, y_cost_temp, y_risk_temp, df_temp, test_size=0.50, random_state=random_state
    )

    print(f"  -> Training Samples: {X_train.shape[0]} (80%)")
    print(f"  -> Evaluation Samples: {X_eval.shape[0]} (10%)")
    print(f"  -> User Holdout Samples: {X_holdout.shape[0]} (10%)")

    # Export User Holdout Dataset for manual testing
    holdout_csv_path = os.path.join(processed_dir, "user_test_holdout.csv")
    holdout_json_path = os.path.join(processed_dir, "user_test_holdout.json")

    df_holdout.to_csv(holdout_csv_path, index=False)

    holdout_records = df_holdout.to_dict(orient="records")
    with open(holdout_json_path, "w") as f:
        json.dump(holdout_records, f, indent=2)

    print(f"  [OK] User Holdout Dataset exported to {holdout_csv_path}")

    # Step 4: Model Training
    print("\nTraining Delay Regressor (RandomForest / XGBoost architecture)...")
    model_delay = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=random_state, n_jobs=-1)
    model_delay.fit(X_train, y_delay_train)

    print("Training Cost Overrun Regressor...")
    model_cost = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=random_state, n_jobs=-1)
    model_cost.fit(X_train, y_cost_train)

    print("Training Risk Tier Classifier...")
    model_risk = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=random_state, n_jobs=-1)
    model_risk.fit(X_train, y_risk_train)

    # Step 5: Model Evaluation on 10% Eval Set
    print("\n" + "=" * 60)
    print("EVALUATION METRICS (10% Test Evaluation Set)")
    print("=" * 60)

    pred_delay_eval = model_delay.predict(X_eval)
    rmse_delay = np.sqrt(mean_squared_error(y_delay_eval, pred_delay_eval))
    mae_delay = mean_absolute_error(y_delay_eval, pred_delay_eval)
    r2_delay = r2_score(y_delay_eval, pred_delay_eval)

    print(f"Delay Model Prediction:")
    print(f"  - RMSE: {rmse_delay:.2f} months")
    print(f"  - MAE:  {mae_delay:.2f} months")
    print(f"  - R²:   {r2_delay:.3f}")

    pred_cost_eval = model_cost.predict(X_eval)
    rmse_cost = np.sqrt(mean_squared_error(y_cost_eval, pred_cost_eval))
    mae_cost = mean_absolute_error(y_cost_eval, pred_cost_eval)
    r2_cost = r2_score(y_cost_eval, pred_cost_eval)

    print(f"\nCost Overrun Model Prediction:")
    print(f"  - RMSE: {rmse_cost:.2f}%")
    print(f"  - MAE:  {mae_cost:.2f}%")
    print(f"  - R²:   {r2_cost:.3f}")

    pred_risk_eval = model_risk.predict(X_eval)
    acc_risk = accuracy_score(y_risk_eval, pred_risk_eval)
    print(f"\nHigh-Risk Classification Accuracy: {acc_risk * 100:.1f}%")

    # Step 6: Save Model Artifacts
    joblib.dump(model_delay, os.path.join(models_dir, "paimana_delay_model.joblib"))
    joblib.dump(model_cost, os.path.join(models_dir, "paimana_cost_model.joblib"))
    joblib.dump(model_risk, os.path.join(models_dir, "paimana_risk_model.joblib"))

    metrics_summary = {
        "train_samples": X_train.shape[0],
        "eval_samples": X_eval.shape[0],
        "holdout_samples": X_holdout.shape[0],
        "delay_rmse": round(rmse_delay, 3),
        "delay_mae": round(mae_delay, 3),
        "delay_r2": round(r2_delay, 3),
        "cost_rmse": round(rmse_cost, 3),
        "cost_mae": round(mae_cost, 3),
        "cost_r2": round(r2_cost, 3),
        "risk_accuracy": round(acc_risk, 3),
        "feature_names": feature_cols
    }

    with open(os.path.join(models_dir, "metrics.json"), "w") as f:
        json.dump(metrics_summary, f, indent=2)

    print(f"\nAll model artifacts saved in {models_dir}/")
    print("=" * 60)
    return metrics_summary


if __name__ == "__main__":
    run_training_pipeline()
