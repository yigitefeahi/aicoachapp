#!/usr/bin/env python3
"""Validate golden_scoring_benchmark.json structure (no API keys)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_root))

def main() -> int:
    p = _root / "data" / "golden_scoring_benchmark.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    assert "cases" in data and isinstance(data["cases"], list)
    for c in data["cases"]:
        assert "id" in c
        assert "expected_score_min" in c and "expected_score_max" in c
        assert c["expected_score_min"] <= c["expected_score_max"]
    print("ci_golden_file: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
