# memory.py
"""
Memory layer for the complete_agent package.
Implements short‑term scratchpad (trace) and a persistent context buffer.
Provides utility methods for logging thoughts, actions, and observations.
"""

from __future__ import annotations

import time
from typing import Any, Dict, List


class WorkingMemory:
    """Short‑term memory used by agents during a ReAct loop.

    Attributes
    ----------
    scratchpad: List[Dict[str, Any]]
        Ordered log of each step (thought, action, observation).
    context_buffer: Dict[str, Any]
        Mutable dictionary that survives across loop iterations – useful for
        passing data between tool calls or between agents.
    """

    def __init__(self) -> None:
        self.scratchpad: List[Dict[str, Any]] = []
        self.context_buffer: Dict[str, Any] = {}

    # ---------------------------------------------------------------------
    # Logging helpers – each appends a structured entry with a timestamp.
    # ---------------------------------------------------------------------
    def log_thought(self, step: int, thought: str) -> None:
        self.scratchpad.append(
            {
                "step": step,
                "type": "THOUGHT",
                "content": thought,
                "timestamp": time.time(),
            }
        )

    def log_action(self, step: int, tool_name: str, tool_input: Any) -> None:
        self.scratchpad.append(
            {
                "step": step,
                "type": "ACTION",
                "tool": tool_name,
                "input": tool_input,
                "timestamp": time.time(),
            }
        )

    def log_observation(self, step: int, observation: Any) -> None:
        self.scratchpad.append(
            {
                "step": step,
                "type": "OBSERVATION",
                "content": observation,
                "timestamp": time.time(),
            }
        )

    # ---------------------------------------------------------------------
    def get_trace(self) -> List[Dict[str, Any]]:
        """Return the full execution trace.

        The returned list is a shallow copy to avoid accidental mutation.
        """
        return list(self.scratchpad)

    def clear(self) -> None:
        """Reset both trace and context – useful for re‑using the same instance.
        """
        self.scratchpad.clear()
        self.context_buffer.clear()
