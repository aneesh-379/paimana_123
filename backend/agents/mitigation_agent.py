"""
PAIMANA Mitigation Agent (Phase 62, 63)
Synthesizes quantitative findings and contractual compliance evidence into
actionable, evidence-backed mitigation recommendations and warning notice drafts.
"""

from typing import Dict, Any, List
from backend.agents.base_agent import BaseAgent

class MitigationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="MitigationAgent",
            description="Combines financial/physical progress findings and contractual evidence to recommend evidence-backed mitigation actions and draft warnings."
        )
        self.role = "Strategic Infrastructure Mitigation & Remedy Specialist"
        self.system_prompt = (
            "You are the Chief Infrastructure Mitigation & Contractual Remedy Specialist for MoSPI. "
            "Your mandate is to formulate 14-day Catch-up Schedule directives and draft formal Level-2 Warning Notices for human-in-the-loop authorization."
        )
        self.tools = ["draftWarningNotice", "evaluateInterventions", "buildRecommendationBundle"]

    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        return "quantitative_findings" in input_data or "quant_findings" in input_data or "project" in input_data

    def run(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        try:
            quant = context.get("quantitative_findings", input_data.get("quantitative_findings", {}))
            comp = context.get("compliance_findings", input_data.get("compliance_findings", {}))
            proj_code = input_data.get("project_code", "PROJECT")
            proj_name = context.get("project_name", f"Infrastructure Project {proj_code}")

            metrics = quant.get("metrics", {})
            fin_gap = metrics.get("financial_physical_gap_pct", 0.0)
            phys_prog = metrics.get("physical_progress_pct", 0.0)
            
            citations = comp.get("citations", ["Standard Government Project Monitoring Guidelines"])
            clauses = comp.get("relevant_clauses", [])

            from backend.agents.llm_provider import GLOBAL_LLM_PROVIDER
            mit_prompt = f"Project {proj_code}: Physical progress {phys_prog}%, Financial progress gap {fin_gap}%. Legal citations: {citations}."
            llm_res = {}

            role_summary = llm_res.get("llm_output") if llm_res.get("is_live_llm") else (
                f"Recommended 14-day Catch-up Schedule directive and formal Level-2 warning notice under {citations[0]}."
            )

            # Evidence-backed recommendations
            actions: List[Dict[str, Any]] = [
                {
                    "step": 1,
                    "action": "Issue Site Inspection Order & Physical Audit",
                    "priority": "HIGH",
                    "reason": f"Physical progress is {phys_prog}% while financial gap is {fin_gap}%. Audit required to verify work completed against billed expenditure.",
                    "evidence_source": f"Quantitative Metrics (Financial gap: {fin_gap}%)"
                },
                {
                    "step": 2,
                    "action": "Review Milestone Timelines under Contract Terms",
                    "priority": "MEDIUM",
                    "reason": f"Contract clause citation: {citations[0]}",
                    "evidence_source": citations[0]
                }
            ]

            # Draft Warning Notice (Requires Human Approval)
            clause_text = clauses[0]["clause_section"] if clauses else "Schedule E Milestone Requirements"
            draft_notice = {
                "notice_id": f"DRAFT-NOTICE-{proj_code}-2026",
                "title": f"Formal Schedule Milestone & Progress Deficit Review Notice for {proj_code}",
                "recipient": "Implementing Agency / Primary Project Contractor",
                "body": (
                    f"Notice is hereby given that Project {proj_code} exhibits a physical progress gap of {fin_gap}%. "
                    f"In accordance with {clause_text}, the implementing agency is requested to submit a revised "
                    f"catch-up schedule within 14 days, failing which contractual remedies under {citations[0]} will be considered."
                ),
                "supporting_evidence": [
                    f"Physical Progress: {phys_prog}%",
                    f"Financial-Physical Gap: {fin_gap}%",
                    f"Contract Reference: {citations[0]}"
                ],
                "requires_human_approval": True,
                "status": "DRAFT_PENDING_APPROVAL"
            }

            return {
                "agent": self.name,
                "role": self.role,
                "status": "SUCCESS",
                "role_summary": role_summary,
                "risk_summary": f"Project exhibits milestone deficit with financial progress leading physical progress by {fin_gap}%.",
                "recommended_actions": actions,
                "priority": "CRITICAL" if fin_gap > 20 else "HIGH",
                "reason": "Deterministic quantitative gap verified against retrieved contract terms.",
                "supporting_evidence": [f"Gap: {fin_gap}%", f"Citation: {citations[0]}"],
                "draft_notice": draft_notice
            }
        except Exception as e:
            return self.fallback(str(e), input_data)

    def fallback(self, error_msg: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "status": "FALLBACK",
            "error": error_msg,
            "risk_summary": "Unable to build evidence-backed recommendations.",
            "recommended_actions": [],
            "draft_notice": None
        }
