#!/usr/bin/env python3
"""
CI quality gate: deterministic checks on evaluation helpers (no OpenAI calls).
Run from repo root: python scripts/ci_evaluation_gate.py
"""

from __future__ import annotations

import sys
from pathlib import Path

_backend = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_backend))

from app.interview_evaluation import score_reliability  # noqa: E402
from app.reporting import build_regression_snapshot  # noqa: E402
from app.models import InterviewSession  # noqa: E402


def main() -> int:
    stable = score_reliability([72, 73, 72, 74])
    assert stable["consistency_label"] in {"high", "moderate"}, stable

    volatile = score_reliability([40, 90, 50, 80])
    assert volatile["consistency_label"] == "low", volatile

    snap = build_regression_snapshot([])
    assert snap.get("status") == "insufficient_data", snap

    empty_session = InterviewSession(
        user_id=1,
        profession="Test",
        result_json={"status": "completed", "final_summary": {"score": 70, "confidence_score": 70, "red_flags": []}},
    )
    snap2 = build_regression_snapshot([empty_session])
    assert snap2.get("status") in {"pass", "fail"}, snap2

    print("ci_evaluation_gate: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
