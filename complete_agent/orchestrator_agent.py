# orchestrator_agent.py
"""
OrchestratorAgent coordinates multiple specialised agents.
It selects an appropriate agent based on a simple keyword routing table –
this mirrors the analysis where the original repo had a lightweight router.
The implementation demonstrates how to plug in more sophisticated planners
(e.g., LangChain planners) later.
"""

from __future__ import annotations

from typing import Dict, List, Optional

from .base_agent import BaseAgent
from .agent_registry import AGENT_REGISTRY


class OrchestratorAgent(BaseAgent):
    """Top‑level orchestrator that forwards a user goal to a specialised agent.

    The routing strategy is keyword‑based for simplicity but can be overridden
    by subclassing and providing a custom ``route`` method.
    """

    def __init__(self) -> None:
        super().__init__(
            name="Orchestrator",
            description="Routes user goals to the most suitable specialised agent.",
            role="Coordinator",
            max_iterations=3,
        )

    # ------------------------------------------------------------------
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        if "goal" not in input_data:
            raise ValueError("Input payload must contain a 'goal' field.")
        return True

    # ------------------------------------------------------------------
    def route(self, goal: str) -> BaseAgent:
        """Simple keyword routing.

        Extend this method with ML‑based intent classification if desired.
        """
        lowered = goal.lower()
        if "risk" in lowered:
            return AGENT_REGISTRY.get_agent("RiskAgent")
        if "compliance" in lowered:
            return AGENT_REGISTRY.get_agent("ComplianceAgent")
        # Default fallback
        return AGENT_REGISTRY.get_agent("PerceptionMLAgent")

    # ------------------------------------------------------------------
    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self.validate_input(input_data)
        goal = input_data["goal"]
        selected_agent = self.route(goal)
        # Forward the goal to the chosen agent's ReAct loop.
        result = selected_agent.run_react_loop(user_goal=goal, context=context)
        # Propagate the selected agent name for traceability.
        result["selected_agent"] = selected_agent.name
        return result

    # ------------------------------------------------------------------
    def fallback(self, error_msg: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "FAILURE",
            "error": error_msg,
            "role_summary": f"Orchestrator failed to process goal: {input_data.get('goal', '')}",
        }
