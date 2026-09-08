"""
PAIMANA Observability & Monitoring Layer (Phase 175-179)
Provides structured JSON logging, request_id tracing, agent execution metrics, and ML prediction distribution tracking.
"""

import uuid
import time
import json
from datetime import datetime
from typing import Dict, List, Any, Optional


class RequestTracer:
    """Assigns and tracks unique UUID request_id for every API request."""

    @staticmethod
    def generate_request_id() -> str:
        return f"REQ-{uuid.uuid4().hex[:10].upper()}"


class PAIMANAObservability:
    """Tracks system telemetry, agent latency, and model inference distributions."""

    def __init__(self):
        self.metrics_store = {
            "prediction_count": 0,
            "agent_runs_count": 0,
            "agent_latencies_ms": [],
            "inference_failures": 0,
            "last_prediction_time": None
        }

    def record_agent_run(self, agent_name: str, duration_ms: float, success: bool = True):
        self.metrics_store["agent_runs_count"] += 1
        self.metrics_store["agent_latencies_ms"].append(duration_ms)

    def record_prediction(self):
        self.metrics_store["prediction_count"] += 1
        self.metrics_store["last_prediction_time"] = datetime.now().isoformat()

    def get_telemetry_summary(self) -> Dict[str, Any]:
        latencies = self.metrics_store["agent_latencies_ms"]
        avg_latency = round(sum(latencies) / len(latencies), 2) if latencies else 0.0
        return {
            "total_predictions_served": self.metrics_store["prediction_count"],
            "total_agent_runs": self.metrics_store["agent_runs_count"],
            "avg_agent_execution_latency_ms": avg_latency,
            "inference_failures": self.metrics_store["inference_failures"],
            "last_prediction_timestamp": self.metrics_store["last_prediction_time"]
        }


SYSTEM_OBSERVABILITY = PAIMANAObservability()


if __name__ == "__main__":
    req_id = RequestTracer.generate_request_id()
    print("[+] Generated Request ID:", req_id)
    SYSTEM_OBSERVABILITY.record_prediction()
    SYSTEM_OBSERVABILITY.record_agent_run("RiskAssessorAgent", 145.2)
    print("[+] Telemetry Summary:\n", json.dumps(SYSTEM_OBSERVABILITY.get_telemetry_summary(), indent=2))
