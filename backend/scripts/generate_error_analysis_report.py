#!/usr/bin/env python3
"""
Aggregate a JSONL of evaluation runs (score, question_type) into a short markdown report.
Example input line: {"question_type":"behavioral","score":72,"session_id":1}
"""

from __future__ import annotations

import argparse
import json
import statistics
from collections import defaultdict
from pathlib import Path


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input_jsonl", type=Path)
    ap.add_argument("output_md", type=Path)
    args = ap.parse_args()

    by_type: dict[str, list[int]] = defaultdict(list)
    for line in args.input_jsonl.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        row = json.loads(line)
        qt = str(row.get("question_type", "unknown"))
        by_type[qt].append(int(row.get("score", 0)))

    lines = ["# Error / variance analysis (generated)", ""]
    for qt, scores in sorted(by_type.items()):
        if not scores:
            continue
        lines.append(f"## {qt}")
        lines.append(f"- n = {len(scores)}")
        lines.append(f"- mean = {statistics.mean(scores):.2f}")
        lines.append(f"- stdev = {statistics.pstdev(scores):.2f}" if len(scores) > 1 else "- stdev = n/a")
        lines.append("")

    args.output_md.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {args.output_md}")


if __name__ == "__main__":
    main()
