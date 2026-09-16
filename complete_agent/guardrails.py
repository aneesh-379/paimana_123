# guardrails.py
"""
GuardrailsEngine implements lightweight safety and grounding checks.
It is deliberately extensible – users can subclass it to plug in
more sophisticated policies (e.g., toxicity detectors, signature verification).
"""

from __future__ import annotations

import re
from typing import Any, List


class GuardrailsEngine:
    """Simple guard‑rails used by the complete_agent framework.

    The default implementation provides:
    * Input sanitisation – removes known prompt‑injection patterns.
    * Grounding verification – ensures a response is non‑empty and that at
      least one piece of evidence (the original goal) is supplied.
    Sub‑classes may override the two static methods for richer behaviour.
    """

    # Patterns that are frequently abused to override system instructions.
    _BAD_PATTERNS = [
        r"ignore previous instructions",
        r"override rules",
        r"system prompt",
        r"you are now",
    ]

    @staticmethod
    def sanitize_input(text: str) -> str:
        """Remove any known injection phrases from *text*.

        The function is case‑insensitive and works on raw strings.
        """
        cleaned = text
        for pat in GuardrailsEngine._BAD_PATTERNS:
            cleaned = re.sub(pat, "", cleaned, flags=re.IGNORECASE)
        return cleaned.strip()

    @staticmethod
    def verify_grounding(response_text: str, evidence: List[Any]) -> bool:
        """Very basic grounding check.

        Returns ``True`` when the response is non‑empty and *evidence* is not
        empty. Real implementations would cross‑reference a vector store or a
        citation database.
        """
        return bool(response_text and evidence)
