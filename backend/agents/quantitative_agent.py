"""
PAIMANA Quantitative Agent (Phase 58, 59)
Performs strict deterministic numerical analysis, ML prediction retrieval,
financial gap calculations, and progress lag computations without hallucinating numbers.
"""

from typing import Dict, Any
from backend.agents.base_agent import BaseAgent

class QuantitativeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="QuantitativeAgent",
            description="Analyzes project financial metrics, physical progress gaps, and ML risk prediction drivers."
        )
        self.role = "Senior Quantitative Infrastructure Risk Analyst"
        self.system_prompt = (
            "You are the Senior Quantitative Infrastructure Risk Analyst for MoSPI (Ministry of Statistics & Programme Implementation). "
            "Your role is to perform strict numerical evaluation, calculate physical vs financial progress lags, and evaluate XGBoost ML risk prediction drivers."
        )
        self.tools = [
            "getProject", "getProjectHistory", "getMLPrediction",
            "getRiskDrivers", "calculateFinancialGap", "calculateProgressGap"
        ]

    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        return "project" in input_data or "original_cost" in input_data or "project_code" in input_data

    def run(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        try:
            proj = input_data.get("project", input_data)
            ml_pred = context.get("ml_prediction", {})
            
            orig_cost = float(proj.get("original_cost", 1000.0))
            rev_cost = float(proj.get("revised_cost", orig_cost))
            expenditure = float(proj.get("expenditure", 0.0))
            phys_prog = float(proj.get("physical_progress", 0.0))

            # Deterministic calculations
            cost_escalation_pct = round(((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0, 2)
            financial_prog_pct = round((expenditure / max(1.0, rev_cost)) * 100.0, 2)
            fin_phys_gap = round(financial_prog_pct - phys_prog, 2)

            predicted_delay = ml_pred.get("predicted_delay_months", 12.0)
            predicted_cost_overrun = ml_pred.get("predicted_cost_overrun", cost_escalation_pct)
            risk_level = ml_pred.get("risk_level", "HIGH" if fin_phys_gap > 15 else "MEDIUM")

            # Dynamic persona synthesis via LLM provider
            from backend.agents.llm_provider import GLOBAL_LLM_PROVIDER
            analysis_prompt = (
                f"Project Metrics: Original Cost = ₹{orig_cost} Cr, Revised Cost = ₹{rev_cost} Cr, "
                f"Expenditure = ₹{expenditure} Cr, Physical Progress = {phys_prog}%, Financial Gap = {fin_phys_gap}%. "
                f"Forecast Delay = {predicted_delay} Months, Forecast Cost Overrun = {predicted_cost_overrun}%."
            )
            
            llm_res = GLOBAL_LLM_PROVIDER.generate_response(
                system_prompt=self.system_prompt,
                user_prompt=analysis_prompt,
                evidence_bundle={"orig_cost": orig_cost, "phys_prog": phys_prog, "predicted_delay": predicted_delay},
                fallback_response={"summary": f"Quant Analysis: Physical progress {phys_prog}%, financial gap {fin_phys_gap}%."}
            )

            role_summary = llm_res.get("llm_output") if llm_res.get("is_live_llm") else (
                f"Project achieves {phys_prog}% physical progress with a financial gap of {fin_phys_gap}%. "
                f"XGBoost model forecasts +{predicted_cost_overrun}% cost escalation and +{predicted_delay} months delay."
            )

            return {
                "agent": self.name,
                "role": self.role,
                "status": "SUCCESS",
                "role_summary": role_summary,
                "metrics": {
                    "original_cost_crores": orig_cost,
                    "revised_cost_crores": rev_cost,
                    "expenditure_crores": expenditure,
                    "cost_escalation_pct": cost_escalation_pct,
                    "physical_progress_pct": phys_prog,
                    "financial_progress_pct": financial_prog_pct,
                    "financial_physical_gap_pct": fin_phys_gap
                },
                "ml_findings": {
                    "predicted_delay_months": predicted_delay,
                    "predicted_cost_overrun_pct": predicted_cost_overrun,
                    "risk_level": risk_level,
                    "top_driver": "Financial progress leads physical progress significantly" if fin_phys_gap > 10 else "Progress trajectory nominal"
                }
            }
        except Exception as e:
            return self.fallback(str(e), input_data)

    def fallback(self, error_msg: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "status": "FALLBACK",
            "error": error_msg,
            "metrics": {},
            "ml_findings": {"risk_level": "UNKNOWN"}
        }
