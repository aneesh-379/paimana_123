# base_agent.py
"""
Complete, production‑grade base class for all agents in the ``complete_agent`` package.
It incorporates every architectural slice identified in the analysis:
- System‑prompt handling
- Short‑term & persistent memory (WorkingMemory)
- Tool registration & execution (ToolRegistry)
- Guardrails (input sanitisation & grounding verification)
- Planning / orchestration via a ReAct‑style loop with configurable max steps
- Optional OpenTelemetry instrumentation points
- Extensible abstract methods for validation, core logic and fallback.
"""

from __future__ import annotations

import logging
import time
from abc import ABC, abstractmethod
from typing import Any, Callable, Dict, List, Optional

from .memory import WorkingMemory
from .tool_registry import ToolRegistry
from .guardrails import GuardrailsEngine

# Optional telemetry – if the ``telemetry`` module is present it will emit spans.
try:
    from .telemetry import tracer
except Exception:  # pragma: no cover
    tracer = None

logger = logging.getLogger("complete_agent.base")


class BaseAgent(ABC):
    """Abstract base class implementing the 5‑layer ReAct architecture.

    Parameters
    ----------
    name: str
        Unique identifier for the agent.
    description: str
        Human‑readable description used in prompts and metadata.
    role: str, optional
        Short role label (defaults to ``"Specialized AI Worker Agent"``).
    max_iterations: int, optional
        Upper bound for the ReAct loop to avoid infinite cycles.
    """

    def __init__(
        self,
        name: str,
        description: str,
        role: str = "Specialized AI Worker Agent",
        max_iterations: int = 5,
    ) -> None:
        self.name = name
        self.description = description
        self.role = role
        self.max_iterations = max_iterations

        # Construct a deterministic system prompt – callers may extend it.
        self.system_prompt = f"You are {self.name} ({self.role}). {self.description}"

        # Core layers
        self.memory: WorkingMemory = WorkingMemory()
        self.tool_registry: ToolRegistry = ToolRegistry()
        self.guardrails: GuardrailsEngine = GuardrailsEngine()

        # Populate default tools (e.g., simple "echo" for testing).
        self._register_builtin_tools()

    # ------------------------------------------------------------------
    def _register_builtin_tools(self) -> None:
        """Register a minimal set of built‑in utilities.

        Concrete agents should call ``self.tool_registry.register_tool`` in their
        ``__init__`` to add domain‑specific capabilities.
        """

        def echo(text: str) -> str:
            """Return the supplied text unchanged – useful for debugging."""
            return text

        self.tool_registry.register_tool(
            name="echo",
            description="Return the supplied string unchanged.",
            func=echo,
            schema={"type": "object", "properties": {"text": {"type": "string"}}, "required": ["text"]},
        )

    # ------------------------------------------------------------------
    @abstractmethod
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate the incoming payload against agent‑specific expectations.

        Returns ``True`` if the payload is acceptable, otherwise raise an
        informative ``ValueError``.
        """

    # ------------------------------------------------------------------
    @abstractmethod
    def run(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Core operational logic for the agent.

        Must return a dictionary containing at least ``"status"`` (``"SUCCESS"``
        or ``"FAILURE"``) and optionally ``"role_summary"``.
        """

    # ------------------------------------------------------------------
    @abstractmethod
    def fallback(self, error_msg: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Graceful error handling path when ``run`` raises an exception.
        """

    # ------------------------------------------------------------------
    def run_react_loop(
        self,
        user_goal: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute the ReAct loop.

        The loop
        1. Sanitises the goal via guardrails.
        2. Logs a *thought*.
        3. Calls ``self.run`` (agent‑specific logic).
        4. Logs the observation.
        5. Stops when ``status == "SUCCESS"`` or ``max_iterations`` is hit.
        """
        if tracer:
            span = tracer.start_as_current_span("BaseAgent.run_react_loop")
        else:
            span = None
        try:
            clean_goal = self.guardrails.sanitize_input(user_goal)
            self.memory.context_buffer = context or {}
            step = 1
            final_answer = ""
            while step <= self.max_iterations:
                # 1️⃣ Thought
                thought = f"Step {step}: analysing goal '{clean_goal}' as {self.role}."
                self.memory.log_thought(step, thought)

                # 2️⃣ Core agent logic – wrapped in a safe try/except
                try:
                    result = self.run(self.memory.context_buffer, context or {})
                except Exception as exc:  # pragma: no cover
                    logger.exception("Agent %s raised during run", self.name)
                    result = self.fallback(str(exc), self.memory.context_buffer)

                # 3️⃣ Observation
                self.memory.log_observation(step, result.get("role_summary", ""))

                # 4️⃣ Success check
                if result.get("status") == "SUCCESS":
                    final_answer = result.get("role_summary", "")
                    break

                step += 1

            # 5️⃣ Assemble final payload
            return {
                "agent": self.name,
                "role": self.role,
                "system_prompt": self.system_prompt,
                "architecture": "ReAct_5_Layer",
                "execution_trace": self.memory.get_trace(),
                "final_output": final_answer,
                "grounding_verified": self.guardrails.verify_grounding(final_answer, [clean_goal]),
            }
        finally:
            if span:
                span.end()
