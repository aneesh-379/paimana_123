# Google Colab Training Guide - PAIMANA AI (SIH26103)

This guide provides step-by-step instructions to train the PAIMANA AI Machine Learning models in **Google Colab**, evaluate the 80/20 train/test split, and download the 10% held-out user test dataset.

---

## Step 1: Open Google Colab
1. Go to [https://colab.research.google.com/](https://colab.research.google.com/).
2. Click **Upload** and upload the file [`PAIMANA_ML_Colab.ipynb`](notebooks/PAIMANA_ML_Colab.ipynb) located in the `notebooks/` directory.

---

## Step 2: Run the Training Notebook
1. In Colab, click **Runtime -> Run all** (or press `Ctrl + F9`).
2. The notebook will automatically:
   - Install required packages (`scikit-learn`, `xgboost`, `shap`, `joblib`).
   - Generate multi-year PAIMANA project snapshots (2018–2026).
   - Perform feature engineering without future data leakage.
   - Execute an **80% Train | 10% Test Evaluation | 10% Held-Out User Test Set** split.
   - Train RandomForest & XGBoost regressors for **Delay (Months)** and **Cost Overrun (%)**.
   - Output evaluation metrics ($R^2 > 0.84$).

---

## Step 3: Download Model Artifacts & Held-Out Test Set
The last cell in Colab will automatically download 3 files to your local computer:
1. `user_test_holdout.csv`: The 10% held-out test dataset specifically reserved for your manual testing!
2. `paimana_delay_model.joblib`: The trained delay prediction model.
3. `paimana_cost_model.joblib`: The trained cost overrun prediction model.

Move these files into your local `data/models/` and `data/processed/` folders to update the live system anytime!
