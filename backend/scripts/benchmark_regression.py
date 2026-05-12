import json
from pathlib import Path

from app.db import SessionLocal
from app.models import InterviewSession
from app.reporting import build_regression_snapshot


def run_local_benchmark():
    output_path = Path(__file__).resolve().parent.parent / "data" / "benchmark_snapshot.json"
    db = SessionLocal()
    try:
        sessions = db.query(InterviewSession).order_by(InterviewSession.id.desc()).limit(100).all()
        snapshot = build_regression_snapshot(sessions)
    finally:
        db.close()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    print(json.dumps({"status": "ok", "snapshot_path": str(output_path), "snapshot": snapshot}))


if __name__ == "__main__":
    run_local_benchmark()
