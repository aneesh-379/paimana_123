"""
PAIMANA Agent Registry (Phase 65)
Registers and manages instances of all specialized AI agents.
"""

from typing import Dict, Any, List
from backend.agents.base_agent import BaseAgent
from backend.agents.quantitative_agent import QuantitativeAgent
from backend.agents.compliance_agent import ComplianceAgent
from backend.agents.mitigation_agent import MitigationAgent
from backend.agents.orchestrator_agent import OrchestratorAgent

class AgentRegistry:
    def __init__(self):
        self._registry: Dict[str, BaseAgent] = {}
        self.register_agent("QuantitativeAgent", QuantitativeAgent())
        self.register_agent("ComplianceAgent", ComplianceAgent())
        self.register_agent("MitigationAgent", MitigationAgent())
        self.orchestrator = OrchestratorAgent()

    def register_agent(self, name: str, agent_instance: BaseAgent):
        self._registry[name] = agent_instance

    def get_agent(self, name: str) -> BaseAgent:
        if name not in self._registry:
            raise KeyError(f"Agent '{name}' not found in registry.")
        return self._registry[name]

    def list_agents(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": name,
                "description": agent.description,
                "tools": agent.tools
            }
            for name, agent in self._registry.items()
        ]

AGENT_REGISTRY = AgentRegistry()
