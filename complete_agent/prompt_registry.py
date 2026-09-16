# prompt_registry.py
"""
PromptRegistry provides a thin wrapper around filesystem‑based prompt templates.
It supports versioned prompts via an optional YAML front‑matter block at the
top of each file.  The front‑matter may contain ``version`` and ``created_at``
fields.  The registry caches raw templates and their metadata for fast
retrieval and renders them with Jinja2 (if available) or ``str.format``.

Usage example:

>>> registry = PromptRegistry()
>>> rendered = registry.render("system.txt", name="Alice", role="assistant")
>>> meta = registry.get_metadata("system.txt")
>>> print(meta.version, meta.created_at)
"""

from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Tuple

try:
    from jinja2 import Environment, FileSystemLoader, select_autoescape
except Exception:  # pragma: no cover
    Environment = None

PROMPT_DIR = Path(__file__).parent / "prompts"

# Regex to capture optional YAML front‑matter at the start of a file.
_FRONT_MATTER_RE = re.compile(r"^---\n(?P<yaml>.+?)\n---\n", re.DOTALL)


class PromptMetadata:
    """Container for prompt version information."""

    def __init__(self, version: str | None, created_at: datetime | None):
        self.version = version
        self.created_at = created_at

    def __repr__(self) -> str:  # pragma: no cover
        return f"PromptMetadata(version={self.version!r}, created_at={self.created_at!r})"


class PromptRegistry:
    """Load, render, and version prompt templates.

    The registry lazily loads files from the ``prompts/`` directory, parses any
    YAML front‑matter, caches the raw template and its metadata, and provides a
    ``render`` method that accepts keyword variables.
    """

    def __init__(self) -> None:
        self._cache: Dict[str, Tuple[str, PromptMetadata]] = {}
        if Environment:
            self._env = Environment(
                loader=FileSystemLoader(str(PROMPT_DIR)),
                autoescape=select_autoescape([]),
                keep_trailing_newline=True,
            )
        else:
            self._env = None

    # ---------------------------------------------------------------------
    def _parse_front_matter(self, text: str) -> Tuple[str, PromptMetadata]:
        """Extract optional YAML front‑matter and return the body and metadata.

        The YAML block is very lightweight – only ``version`` and ``created_at``
        are recognised.  ``created_at`` must be an ISO‑8601 timestamp.
        """
        match = _FRONT_MATTER_RE.match(text)
        if not match:
            return text, PromptMetadata(version=None, created_at=None)
        yaml_block = match.group("yaml")
        version = None
        created_at = None
        for line in yaml_block.splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            key = key.strip().lower()
            value = value.strip()
            if key == "version":
                version = value
            elif key == "created_at":
                try:
                    created_at = datetime.fromisoformat(value)
                except Exception:
                    created_at = None
        body = text[match.end() :]
        return body, PromptMetadata(version=version, created_at=created_at)

    # ---------------------------------------------------------------------
    def _load(self, filename: str) -> Tuple[str, PromptMetadata]:
        """Read a prompt file, parse its metadata, and cache the result.

        Raises
        ------
        FileNotFoundError
            If the file does not exist under ``prompts/``.
        """
        if filename in self._cache:
            return self._cache[filename]
        path = PROMPT_DIR / filename
        if not path.is_file():
            raise FileNotFoundError(f"Prompt file '{filename}' not found in {PROMPT_DIR}")
        content = path.read_text(encoding="utf-8")
        body, meta = self._parse_front_matter(content)
        self._cache[filename] = (body, meta)
        return body, meta

    # ---------------------------------------------------------------------
    def render(self, filename: str, **variables: str) -> str:
        """Render a template with supplied variables.

        If Jinja2 is available we use it; otherwise we fall back to ``str.format``
        which expects ``{variable}`` placeholders.
        """
        template_src, _ = self._load(filename)
        if self._env:
            template = self._env.from_string(template_src)
            return template.render(**variables)
        return template_src.format(**variables)

    # ---------------------------------------------------------------------
    def get_metadata(self, filename: str) -> PromptMetadata:
        """Return the parsed metadata for a given prompt file."""
        _, meta = self._load(filename)
        return meta

    # ---------------------------------------------------------------------
    def list_versions(self) -> Dict[str, PromptMetadata]:
        """Return a mapping of prompt filename → metadata for all cached prompts.

        The method forces loading of every file in the ``prompts/`` directory so
        that the returned dictionary reflects the complete set.
        """
        for entry in os.listdir(PROMPT_DIR):
            if entry.startswith('.'):
                continue
            full_path = PROMPT_DIR / entry
            if full_path.is_file():
                self._load(entry)
        return {fname: meta for fname, (_, meta) in self._cache.items()}
```
