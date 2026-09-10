"""
PAIMANA LLM Provider Abstraction & Rate Limiting Engine (Phase 116, 172, 173)
Supports Gemini, OpenAI, and Local LLMs with strict sliding-window rate limiting,
cooldown enforcement, response caching, and transparent API quota protection.
"""

import os
import time
import json
import urllib.request
import urllib.parse
from typing import Dict, List, Any, Optional
from ml.ingestion.data_provenance import EvidenceCategory


def load_env_file(env_path: str = None):
    """Loads key-value pairs from .env file into os.environ without external dependencies."""
    if not env_path:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        env_path = os.path.join(base_dir, ".env")
        
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    os.environ[key] = val


load_env_file()


class RateLimiter:
    """Sliding-window rate limiter & request cooldown manager for external API calls."""

    def __init__(self):
        self.call_timestamps_minute = []
        self.call_timestamps_hour = []
        self.last_call_time = 0.0
        self.response_cache = {}

    def check_rate_limit(self) -> Dict[str, Any]:
        """Validates if new request exceeds minute/hour quota or cooldown."""
        load_env_file()
        max_per_min = int(os.getenv("MAX_LLM_CALLS_PER_MINUTE", "10"))
        max_per_hour = int(os.getenv("MAX_LLM_CALLS_PER_HOUR", "100"))
        min_cooldown = float(os.getenv("MIN_COOLDOWN_SECONDS", "2"))

        now = time.time()

        # Clean timestamps older than 60s / 3600s
        self.call_timestamps_minute = [t for t in self.call_timestamps_minute if now - t < 60.0]
        self.call_timestamps_hour = [t for t in self.call_timestamps_hour if now - t < 3600.0]

        # 1. Cooldown check
        elapsed = now - self.last_call_time
        if elapsed < min_cooldown:
            return {
                "allowed": False,
                "reason": "COOLDOWN_ACTIVE",
                "wait_seconds": round(min_cooldown - elapsed, 1),
                "message": f"Rate Limit: Minimum {min_cooldown}s cooldown between AI agent requests. Please wait {min_cooldown - elapsed:.1f}s."
            }

        # 2. Minute quota check
        if len(self.call_timestamps_minute) >= max_per_min:
            return {
                "allowed": False,
                "reason": "MINUTE_QUOTA_EXCEEDED",
                "wait_seconds": round(60.0 - (now - self.call_timestamps_minute[0]), 1),
                "message": f"Rate Limit: Reached maximum {max_per_min} AI requests/minute limit. Using grounded evidence fallback to protect API quota."
            }

        # 3. Hour quota check
        if len(self.call_timestamps_hour) >= max_per_hour:
            return {
                "allowed": False,
                "reason": "HOUR_QUOTA_EXCEEDED",
                "wait_seconds": round(3600.0 - (now - self.call_timestamps_hour[0]), 1),
                "message": f"Rate Limit: Reached maximum {max_per_hour} AI requests/hour limit. Using grounded evidence fallback."
            }

        return {"allowed": True, "reason": "OK"}

    def record_call(self):
        now = time.time()
        self.last_call_time = now
        self.call_timestamps_minute.append(now)
        self.call_timestamps_hour.append(now)


class LLMProvider:
    """Abstraction layer for invoking NVIDIA NIM / Gemini / OpenAI / Local LLMs with rate limiting and caching."""

    def __init__(self):
        self.rate_limiter = RateLimiter()
        load_env_file()
        self.nvidia_key = os.getenv("LLM_API_KEY", "").strip()
        self.gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    def check_provider_status(self) -> Dict[str, Any]:
        """Returns API key configuration status and quota settings."""
        load_env_file()
        self.nvidia_key = os.getenv("LLM_API_KEY", "").strip()
        self.gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.model_name = os.getenv("LLM_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct").strip()

        has_nvidia = bool(self.nvidia_key)
        has_gemini = bool(self.gemini_key)
        has_openai = bool(self.openai_key)

        if has_nvidia:
            active_provider = f"NVIDIA NIM ({self.model_name})"
            status = "CONFIGURED_LIVE"
        elif has_gemini:
            active_provider = "Google Gemini (gemini-1.5-pro)"
            status = "CONFIGURED_LIVE"
        elif has_openai:
            active_provider = "OpenAI (gpt-4o)"
            status = "CONFIGURED_LIVE"
        else:
            active_provider = "None (Deterministic Evidence Fallback)"
            status = "NO_API_KEY_CONFIGURED"

        return {
            "status": status,
            "active_provider": active_provider,
            "has_nvidia_key": has_nvidia,
            "has_gemini_key": has_gemini,
            "has_openai_key": has_openai,
            "model_name": self.model_name,
            "rate_limits": {
                "max_per_minute": int(os.getenv("MAX_LLM_CALLS_PER_MINUTE", "35")),
                "max_per_hour": int(os.getenv("MAX_LLM_CALLS_PER_HOUR", "2000")),
                "min_cooldown_seconds": float(os.getenv("MIN_COOLDOWN_SECONDS", "2"))
            }
        }

    def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        evidence_bundle: Dict[str, Any],
        fallback_response: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generates dynamic response from LLM under rate limits and caching, or returns fallback."""
        status_info = self.check_provider_status()

        # If no key configured, immediately return transparent fallback
        if status_info["status"] != "CONFIGURED_LIVE":
            return {
                "is_live_llm": False,
                "llm_provider": "Deterministic Evidence Engine",
                "llm_status_notice": "NO_API_KEY_CONFIGURED. Add LLM_API_KEY to your .env file to activate live NVIDIA NIM LLM calls.",
                "rate_limit": status_info["rate_limits"],
                "evidence_category": EvidenceCategory.AI_INTERPRETED,
                "analysis": fallback_response,
                "evidence_bundle_used": evidence_bundle
            }

        # Check Cache to avoid duplicate credit usage
        cache_key = f"{user_prompt}_{json.dumps(evidence_bundle, sort_keys=True)}"
        if cache_key in self.rate_limiter.response_cache:
            return {
                "is_live_llm": True,
                "is_cached": True,
                "llm_provider": status_info["active_provider"],
                "evidence_category": EvidenceCategory.AI_INTERPRETED,
                "llm_output": self.rate_limiter.response_cache[cache_key],
                "evidence_bundle_used": evidence_bundle
            }

        # Rate Limit Check
        rate_check = self.rate_limiter.check_rate_limit()
        if not rate_check["allowed"]:
            return {
                "is_live_llm": False,
                "rate_limit_exceeded": True,
                "rate_limit_reason": rate_check["reason"],
                "llm_status_notice": rate_check["message"],
                "llm_provider": "Deterministic Evidence Engine (Rate Limit Protected)",
                "evidence_category": EvidenceCategory.AI_INTERPRETED,
                "analysis": fallback_response,
                "evidence_bundle_used": evidence_bundle
            }

        # Check if provider had recent network timeout failure
        if getattr(self, "_last_api_failure", 0) and (time.time() - self._last_api_failure < 60.0):
            return {
                "is_live_llm": False,
                "llm_provider": "Deterministic Evidence Engine (Network Failover)",
                "evidence_category": EvidenceCategory.AI_INTERPRETED,
                "analysis": fallback_response,
                "evidence_bundle_used": evidence_bundle
            }

        # Execute Live API call
        if status_info["has_nvidia_key"]:
            try:
                llm_output = self._call_nvidia_nim_api(system_prompt, user_prompt, evidence_bundle)
                self.rate_limiter.record_call()
                self.rate_limiter.response_cache[cache_key] = llm_output
                return {
                    "is_live_llm": True,
                    "is_cached": False,
                    "llm_provider": f"NVIDIA NIM ({status_info['model_name']})",
                    "evidence_category": EvidenceCategory.AI_INTERPRETED,
                    "llm_output": llm_output,
                    "evidence_bundle_used": evidence_bundle
                }
            except Exception as e:
                self._last_api_failure = time.time()
                print(f"[!] NVIDIA NIM API Error: {e}. Falling back to evidence engine.")

        if status_info["has_gemini_key"]:
            try:
                llm_output = self._call_gemini_api(system_prompt, user_prompt, evidence_bundle)
                self.rate_limiter.record_call()
                self.rate_limiter.response_cache[cache_key] = llm_output
                return {
                    "is_live_llm": True,
                    "is_cached": False,
                    "llm_provider": "Google Gemini",
                    "evidence_category": EvidenceCategory.AI_INTERPRETED,
                    "llm_output": llm_output,
                    "evidence_bundle_used": evidence_bundle
                }
            except Exception as e:
                print(f"[!] Gemini API Error: {e}. Falling back to evidence rules.")

        if status_info["has_openai_key"]:
            try:
                llm_output = self._call_openai_api(system_prompt, user_prompt, evidence_bundle)
                self.rate_limiter.record_call()
                self.rate_limiter.response_cache[cache_key] = llm_output
                return {
                    "is_live_llm": True,
                    "is_cached": False,
                    "llm_provider": "OpenAI",
                    "evidence_category": EvidenceCategory.AI_INTERPRETED,
                    "llm_output": llm_output,
                    "evidence_bundle_used": evidence_bundle
                }
            except Exception as e:
                print(f"[!] OpenAI API Error: {e}. Falling back to evidence rules.")

        return {
            "is_live_llm": False,
            "llm_provider": "Deterministic Evidence Engine",
            "evidence_category": EvidenceCategory.AI_INTERPRETED,
            "analysis": fallback_response,
            "evidence_bundle_used": evidence_bundle
        }

    def _call_nvidia_nim_api(self, system_prompt: str, user_prompt: str, evidence: Dict[str, Any]) -> str:
        """Calls NVIDIA NIM OpenAI-compatible endpoint using LLM_API_KEY from environment."""
        load_env_file()
        api_key = os.getenv("LLM_API_KEY", "").strip()
        model_name = os.getenv("LLM_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct").strip()
        url = "https://integrate.api.nvidia.com/v1/chat/completions"

        prompt_content = f"Grounding Fact Bundle:\n{json.dumps(evidence, indent=2)}\n\nUser Prompt / Query:\n{user_prompt}"

        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt_content}
            ],
            "temperature": 0.2,
            "max_tokens": 1024
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]

    def _call_gemini_api(self, system_prompt: str, user_prompt: str, evidence: Dict[str, Any]) -> str:
        """Calls Google Gemini REST API."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={self.gemini_key}"
        prompt_content = f"{system_prompt}\n\nEvidence Context (Grounding Fact Bundle):\n{json.dumps(evidence, indent=2)}\n\nUser Question / Task:\n{user_prompt}"
        
        payload = {"contents": [{"parts": [{"text": prompt_content}]}]}
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _call_openai_api(self, system_prompt: str, user_prompt: str, evidence: Dict[str, Any]) -> str:
        """Calls OpenAI Chat Completions API."""
        url = "https://api.openai.com/v1/chat/completions"
        prompt_content = f"Evidence Context (Grounding Fact Bundle):\n{json.dumps(evidence, indent=2)}\n\nTask:\n{user_prompt}"
        
        payload = {"model": "gpt-4o", "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt_content}]}
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.openai_key}"})
        
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]


GLOBAL_LLM_PROVIDER = LLMProvider()


if __name__ == "__main__":
    provider = LLMProvider()
    st = provider.check_provider_status()
    print("[+] LLM Provider Status & Rate Limits:\n", json.dumps(st, indent=2))
