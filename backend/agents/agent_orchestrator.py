"""
PAIMANA AI Multi-Agent Orchestrator Engine
Unified entry point for the two-tier hierarchical multi-agent workflow:
  Agent I (PerceptionMLAgent) ➔ Sub-Agents (Quantitative, Compliance, Bottleneck, Mitigation) ➔ Agent II (OrchestratorAgent)
"""

from typing import Dict, Any
from backend.agents.orchestrator_agent import OrchestratorAgent, master_orchestrator
from backend.agents.perception_ml_agent import PerceptionMLAgent, perception_ml_agent


class AgentOrchestrator:
    """Master orchestrator for PAIMANA multi-agent analysis."""

    def __init__(self):
        self.perception_agent = perception_ml_agent
        self.orchestrator = master_orchestrator

    def analyze_project(self, project_data: Dict[str, Any], predictions: Dict[str, Any] = None) -> Dict[str, Any]:
        """Runs two-tier multi-agent workflow on a project instance."""
        user_input = {
            "type": "TEXT",
            "message": f"Analyze risk, statutory compliance, and bottlenecks for {project_data.get('project_code', 'PROJECT')}",
            "payload": project_data
        }
        return self.orchestrator.execute_workflow(user_input, project_data)


agent_orchestrator = AgentOrchestrator()
