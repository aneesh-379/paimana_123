# agent_registry.py
"""
Central registry for all agents in the complete_agent package.
It supports static registration of built‑in agents and dynamic discovery of
plugins via ``plugin_loader``.
"""

from __future__ import annotations

from typing import Dict

from .base_agent import BaseAgent
from .orchestrator_agent import OrchestratorAgent

# Import built‑in agents – these modules must exist in the package.
# For the demo we only import the orchestrator; concrete specialised agents
# would be added here (e.g., PerceptionMLAgent, ComplianceAgent, etc.).
try:
    from .perception_ml_agent import PerceptionMLAgent
except Exception:  # pragma: no cover
    PerceptionMLAgent = None

try:
    from .compliance_agent import ComplianceAgent
except Exception:  # pragma: no cover
    ComplianceAgent = None

# The global registry instance – created at import time.
class AgentRegistry:
    def __init__(self) -> None:
        self._registry: Dict[str, BaseAgent] = {}
        self._load_builtin_agents()
        # Dynamically load plugin agents after builtin registration.
        try:
            from .plugin_loader import discover_plugins
            discover_plugins(self)  # type: ignore[arg-type]
        except Exception as e:  # pragma: no cover
            # If the plugin system fails we still want the core to work.
            print(f"[AgentRegistry] Plugin discovery failed: {e}")

    def _load_builtin_agents(self) -> None:
        """Register agents that ship with the package."""
        # Orchestrator is always present.
        self.register_agent("Orchestrator", OrchestratorAgent())
        # Register optional built‑ins if their modules imported successfully.
        if PerceptionMLAgent:
            self.register_agent("PerceptionMLAgent", PerceptionMLAgent())
        if ComplianceAgent:
            self.register_agent("ComplianceAgent", ComplianceAgent())

    def register_agent(self, name: str, agent_instance: BaseAgent) -> None:
        if name in self._registry:
            raise ValueError(f"Agent '{name}' already registered")
        self._registry[name] = agent_instance

    def get_agent(self, name: str) -> BaseAgent:
        try:
            return self._registry[name]
        except KeyError:
            raise KeyError(f"Agent '{name}' not found in registry")

    def list_agents(self) -> list[dict]:
        """Return a serialisable list of agent metadata for UI / API use."""
        return [
            {
                "name": name,
                "role": agent.role,
                "description": agent.description,
                "tools": getattr(agent, "tool_registry", None).list_tool_definitions()
                if hasattr(agent, "tool_registry")
                else [],
            }
            for name, agent in self._registry.items()
        ]

# Create a singleton that can be imported from anywhere.
AGENT_REGISTRY = AgentRegistry()
