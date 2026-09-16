# tool_registry.py
"""
Tool Registry for the complete_agent package.
Provides a central place where tools (functions) are declared with a name,
human‑readable description and an optional JSON schema for validation.
The registry can be queried at runtime and tools can be executed safely.
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional


class ToolRegistry:
    """Runtime registry for callable tools.

    The internal map stores metadata needed for discovery, documentation and
    optional input validation.
    """

    def __init__(self) -> None:
        self._tools: Dict[str, Dict[str, Any]] = {}

    # ---------------------------------------------------------------------
    def register_tool(
        self,
        name: str,
        description: str,
        func: Callable,
        schema: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Register a new tool.

        Parameters
        ----------
        name: str
            Unique identifier used when calling the tool.
        description: str
            Human readable description shown in UI or docs.
        func: Callable
            The Python callable that implements the tool.
        schema: Optional[Dict]
            JSON‑Schema describing the expected input shape.  If ``None`` the
            tool is considered schema‑less.
        """
        if name in self._tools:
            raise ValueError(f"Tool '{name}' already registered")
        self._tools[name] = {
            "name": name,
            "description": description,
            "func": func,
            "schema": schema or {},
        }

    # ---------------------------------------------------------------------
    def execute_tool(self, name: str, **kwargs: Any) -> Any:
        """Execute a registered tool.

        The method performs a tiny validation step using the stored schema if
        present.  For brevity we only check that required keys exist.
        """
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' not found in registry")
        tool_meta = self._tools[name]
        schema = tool_meta.get("schema", {})
        # Very light‑weight validation – real implementations could use jsonschema
        required = schema.get("required", [])
        for key in required:
            if key not in kwargs:
                raise ValueError(f"Missing required argument '{key}' for tool '{name}'")
        return tool_meta["func"](**kwargs)

    # ---------------------------------------------------------------------
    def list_tool_definitions(self) -> List[Dict[str, Any]]:
        """Return a serialisable list of tool metadata (no callables)."""
        return [
            {
                "name": meta["name"],
                "description": meta["description"],
                "schema": meta["schema"],
            }
            for meta in self._tools.values()
        ]
