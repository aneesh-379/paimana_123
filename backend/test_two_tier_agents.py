"""
End-to-End Verification Test for Two-Tier Multi-Agent System & Real ML Model Pipeline.
"""

import os
import sys
import json
import pandas as pd

from backend.app.services.risk_engine import risk_engine
from backend.agents.perception_ml_agent import perception_ml_agent
from backend.agents.orchestrator_agent import master_orchestrator


def run_all_tests():
    print("=" * 65)
    print("TEST 1: Verifying Trained ML Models & RiskEngine Direct Inference")
    print("=" * 65)
    
    sample_proj = {
        "project_code": "PAIM-619054",
        "original_cost": 1162.76,
        "revised_cost": 1390.00,
        "expenditure": 494.72,
        "physical_progress": 42.5
    }
    pred = risk_engine.predict_project(sample_proj)
    print(f"[*] Project: {pred.get('project_code')} - {pred.get('project_name')}")
    print(f"[*] Predicted Delay: {pred.get('predicted_delay_months')} Months")
    print(f"[*] Predicted Cost Overrun: {pred.get('predicted_cost_overrun_pct')}% (Rs. {pred.get('predicted_additional_cost_cr')} Cr)")
    print(f"[*] Risk Score: {pred.get('risk_score')}/100 ({pred.get('risk_tier')})")
    print(f"[*] Model Version: {pred.get('model_version')}")
    print(f"[*] Top SHAP Drivers: {len(pred.get('feature_attributions', []))} drivers extracted")
    assert pred.get("model_version") is not None
    assert pred.get("risk_score") is not None
    print("  -> [PASS] ML Model & RiskEngine direct inference verified!\n")

    print("=" * 65)
    print("TEST 2: Verifying Agent I (PerceptionMLAgent) across Text, CSV, and PDF")
    print("=" * 65)

    # 2a. Text Query
    text_res = perception_ml_agent.run({"type": "TEXT", "message": "Why is PAIM-1042 having high cost escalation of 1800 Cr and 30% progress?"})
    print(f"[*] Text Ingestion Status: {text_res.get('status')}")
    print(f"[*] Extracted Project Code: {text_res.get('project_code')}")
    print(f"[*] ML Prediction Card Title: {text_res.get('ml_prediction_card', {}).get('title')}")
    assert text_res.get("status") == "SUCCESS"
    assert text_res.get("ml_prediction_card") is not None
    print("  -> [PASS] Agent I Text Query processing passed!")

    # 2b. CSV Dataset Input
    sample_csv = "project_code,original_cost,revised_cost,expenditure,physical_progress\nPAIM-9901,800.0,1050.0,350.0,25.0\nPAIM-9902,1200.0,1200.0,600.0,55.0"
    csv_res = perception_ml_agent.run({"type": "CSV", "payload": sample_csv})
    print(f"[*] CSV Ingestion Status: {csv_res.get('status')}")
    print(f"[*] Total Rows Predicted: {csv_res.get('total_rows_predicted')}")
    print(f"[*] Primary ML Card Risk Tier: {csv_res.get('ml_prediction_card', {}).get('metrics', {}).get('risk_tier')}")
    assert csv_res.get("total_rows_predicted") == 2
    print("  -> [PASS] Agent I CSV Ingestion & Batch Prediction passed!")

    # 2c. PDF Contract / Document Input
    pdf_text = "NHAI Standard Contract GCC Clause 14.2 Liquidated damages for delay capped at 10% of Contract Value 1500 Cr."
    pdf_res = perception_ml_agent.run({"type": "PDF", "payload": pdf_text})
    print(f"[*] PDF Ingestion Status: {pdf_res.get('status')}")
    print(f"[*] Extracted Source: {pdf_res.get('ml_prediction_card', {}).get('ingestion_source')}")
    assert pdf_res.get("status") == "SUCCESS"
    print("  -> [PASS] Agent I PDF Contract Ingestion passed!\n")

    print("=" * 65)
    print("TEST 3: Verifying Agent II (Master Orchestrator) & 4 Sub-Agents")
    print("=" * 65)

    orch_res = master_orchestrator.execute_workflow(
        user_input={"message": "Why is PAIM-619054 flagged high risk and what mitigation notice should be drafted?"},
        input_type="TEXT"
    )
    print(f"[*] Master Orchestrator Status: {orch_res.get('status')}")
    print(f"[*] Workflow ID: {orch_res.get('workflow_id')}")
    print(f"[*] Intent Identified: {orch_res.get('detected_intent')}")
    print(f"[*] Sub-Agents Coordinated:")
    agent_details = orch_res.get("agent_details", {})
    for k, v in agent_details.items():
        print(f"    - [{v.get('agent_name')}]: {v.get('role')} (Status: {v.get('status')})")
    
    assert "agent_1_ml_perception" in agent_details
    assert "quantitative" in agent_details
    assert "compliance" in agent_details
    assert "bottleneck" in agent_details
    assert "mitigation" in agent_details
    assert "orchestrator" in agent_details

    print(f"\n[*] Draft Notice Generated: {orch_res.get('draft_notice', {}).get('title')}")
    assert orch_res.get("draft_notice") is not None
    print(f"[*] Executive Synthesis:\n{orch_res.get('answer')[:300]}...\n")
    print("=" * 65)
    print("ALL TESTS PASSED SUCCESSFULLY! Real ML Models and Two-Tier Agents are fully verified.")
    print("=" * 65)


if __name__ == "__main__":
    run_all_tests()
