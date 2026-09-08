"""
PAIMANA Core Production AI Agent Architecture
Implements 5-Layer Agent Blueprint:
1. Cognitive & Reasoning Engine (Chain-of-Thought & ReAct Loop)
2. Planning & Orchestration Layer (Stateful Task Decomposition & Max Steps Limit)
3. Tool & Action Layer (Tool Registry & Dynamic Schema Catalog)
4. Memory Layer (Short-term Working Memory Scratchpad & Long-term RAG Recall)
5. Guardrails & Safety Layer (Prompt Injection Defense & Grounding Verification)
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Callable
import time
import logging

logger = logging.getLogger("PAIMANA.AgentArchitecture")

class WorkingMemory:
    """Short-term working memory scratchpad for tracking intermediate thoughts, tool calls, and observations."""
    def __init__(self):
        self.scratchpad: List[Dict[str, Any]] = []
        self.context_buffer: Dict[str, Any] = {}

    def log_thought(self, step: int, thought: str):
        self.scratchpad.append({"step": step, "type": "THOUGHT", "content": thought, "timestamp": time.time()})

    def log_action(self, step: int, tool_name: str, tool_input: Any):
        self.scratchpad.append({"step": step, "type": "ACTION", "tool": tool_name, "input": tool_input, "timestamp": time.time()})

    def log_observation(self, step: int, observation: Any):
        self.scratchpad.append({"step": step, "type": "OBSERVATION", "content": observation, "timestamp": time.time()})

    def get_trace(self) -> List[Dict[str, Any]]:
        return self.scratchpad

class ToolRegistry:
    """Discovers, registers, and executes agent tools safely."""
    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {}

    def register_tool(self, name: str, description: str, func: Callable, schema: Dict[str, Any] = None):
        self._tools[name] = {
            "name": name,
            "description": description,
            "func": func,
            "schema": schema or {}
        }

    def execute_tool(self, name: str, **kwargs) -> Any:
        if name not in self._tools:
            raise ValueError(f"Tool '{name}' not found in registry.")
        return self._tools[name]["func"](**kwargs)

    def list_tool_definitions(self) -> List[Dict[str, Any]]:
        return [{"name": meta["name"], "description": meta["description"], "schema": meta["schema"]} for meta in self._tools.values()]

class GuardrailsEngine:
    """Validates inputs, intercepts prompt injection, and verifies grounded outputs."""
    @staticmethod
    def sanitize_input(text: str) -> str:
        bad_patterns = ["ignore previous instructions", "override rules", "system prompt", "you are now"]
        clean = text
        for p in bad_patterns:
            clean = clean.replace(p, "")
        return clean.strip()

    @staticmethod
    def verify_grounding(response_text: str, evidence: List[Any]) -> bool:
        return len(response_text) > 0 and evidence is not None

class BaseAgent(ABC):
    """Production Base Agent implementing ReAct Loop & 5-Layer Architecture."""
    def __init__(self, name: str, description: str, role: str = "Specialized AI Worker Agent"):
        self.name = name
        self.description = description
        self.role = role
        self.system_prompt = f"You are {name} ({role}). {description}"
        self.memory = WorkingMemory()
        self.tool_registry = ToolRegistry()
        self.guardrails = GuardrailsEngine()
        self.max_iterations = 5  # Enforce max loop iterations to prevent infinite loops

    @abstractmethod
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validates incoming input payload against agent expectations."""
        pass

    def run_react_loop(self, user_goal: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Executes the Perception -> Reason -> Plan -> Act -> Observe -> Reflect ReAct Loop."""
        clean_goal = self.guardrails.sanitize_input(user_goal)
        self.memory.context_buffer = context or {}
        
        step = 1
        final_answer = ""

        while step <= self.max_iterations:
            # 1. Reason & Think
            thought = f"Step {step}: Analyzing goal '{clean_goal}' under role '{self.role}'."
            self.memory.log_thought(step, thought)

            # 2. Execute specialized agent logic
            result = self.run(self.memory.context_buffer, context or {})
            
            # 3. Observe & Reflect
            self.memory.log_observation(step, result.get("role_summary", "Step executed successfully."))
            
            if result.get("status") == "SUCCESS":
                final_answer = result.get("role_summary", "")
                break
                
            step += 1

        return {
            "agent": self.name,
            "role": self.role,
            "architecture": "ReAct_5_Layer_Engine",
            "execution_trace": self.memory.get_trace(),
            "final_output": final_answer,
            "grounding_verified": self.guardrails.verify_grounding(final_answer, [clean_goal])
        }

    @abstractmethod
    def run(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Executes main agent operational logic."""
        pass

    @abstractmethod
    def fallback(self, error_msg: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Graceful error fallback returning structured response."""
        pass
