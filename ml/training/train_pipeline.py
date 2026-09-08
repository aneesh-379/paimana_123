"""
PAIMANA ML Training Pipeline (Standard Entrypoint)
Trains Random Forest and XGBoost predictive models on real user training & test datasets (traindata.csv and Testdata.xlsx).
Saves validated model artifacts into data/models/.
"""

import os
from ml.training.train_real_models import train_on_real_user_data


def run_training_pipeline(
    train_path: str = "data/processed/traindata.csv",
    test_path: str = "data/processed/Testdata.csv",
    models_dir: str = "data/models",
    random_state: int = 42
):
    """Executes model training and metric evaluation on real user datasets."""
    return train_on_real_user_data(
        train_path=train_path,
        test_path=test_path,
        models_dir=models_dir,
        random_state=random_state
    )


if __name__ == "__main__":
    run_training_pipeline()
