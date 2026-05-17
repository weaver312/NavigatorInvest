#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import signal
import time
from datetime import datetime, time as clock_time, timezone
from pathlib import Path
from typing import Optional
from zoneinfo import ZoneInfo

APPLICATION_ID = "app_path_power_hour_v_rebound_tsll"
PATH_DEFINITION_ID = "path_power_hour_v_rebound_fixed_tp_sl"
TARGET_SYMBOL = "TSLL"
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RUNTIME_DIR = ROOT / "runtime" / "path_applications" / APPLICATION_ID
ET = ZoneInfo("America/New_York")
UTC = timezone.utc

PHASE_ACTIONS = {
    "market_closed_weekend": "美股周末休市，仅维持心跳。",
    "overnight_idle": "隔夜等待，维持 24h 心跳。",
    "pre_market_idle": "盘前等待，不生成入场候选。",
    "regular_session_waiting": "常规盘中等待 14:35 ET 参考高点窗口。",
    "reference_high_window": "记录 14:35-14:50 ET 参考高点窗口。",
    "signal_window": "监听 14:50-15:00 ET 固定尾段与 VWAP 深度偏离上拐信号。",
    "position_management_window": "若已有入场，跟踪固定 TP/SL；否则等待尾部结束。",
    "tail_exit_cutoff": "执行或确认 15:59:30 ET 尾部退出逻辑。",
    "after_hours_idle": "盘后等待，维持心跳并准备下一交易日。",
}

SHOULD_STOP = False


def handle_stop(_signum: int, _frame: object) -> None:
    global SHOULD_STOP
    SHOULD_STOP = True


def market_phase(now_et: datetime) -> str:
    if now_et.weekday() >= 5:
        return "market_closed_weekend"

    t = now_et.time()
    if t < clock_time(4, 0):
        return "overnight_idle"
    if t < clock_time(9, 30):
        return "pre_market_idle"
    if t < clock_time(14, 35):
        return "regular_session_waiting"
    if t < clock_time(14, 50):
        return "reference_high_window"
    if t < clock_time(15, 0):
        return "signal_window"
    if t < clock_time(15, 59, 30):
        return "position_management_window"
    if t < clock_time(16, 0):
        return "tail_exit_cutoff"
    if t < clock_time(20, 0):
        return "after_hours_idle"
    return "overnight_idle"


def write_json_atomic(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(f"{path.suffix}.tmp")
    tmp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp_path.replace(path)


def append_jsonl(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n")


def build_heartbeat(args: argparse.Namespace) -> dict:
    now_utc = datetime.now(UTC)
    now_et = now_utc.astimezone(ET)
    phase = market_phase(now_et)
    return {
        "application_id": args.application_id,
        "path_definition_id": args.path_definition_id,
        "target_symbol": args.target_symbol,
        "runtime_state": "running",
        "monitor_script": "monitors/tsll_power_hour_v_rebound_monitor.py",
        "pid": os.getpid(),
        "phase": phase,
        "phase_action": PHASE_ACTIONS[phase],
        "trade_execution": "disabled_in_listener",
        "poll_seconds": args.poll_seconds,
        "last_check_at_utc": now_utc.isoformat(timespec="seconds"),
        "last_check_at_et": now_et.isoformat(timespec="seconds"),
        "next_check_after_seconds": args.poll_seconds,
        "heartbeat_ref": str(args.runtime_dir / "heartbeat.json"),
        "log_ref": str(args.runtime_dir / "monitor.log"),
    }


def write_pid_file(runtime_dir: Path) -> None:
    runtime_dir.mkdir(parents=True, exist_ok=True)
    (runtime_dir / "monitor.pid").write_text(f"{os.getpid()}\n", encoding="utf-8")


def record_heartbeat(args: argparse.Namespace, previous_phase: Optional[str]) -> str:
    payload = build_heartbeat(args)
    heartbeat_path = args.runtime_dir / "heartbeat.json"
    write_json_atomic(heartbeat_path, payload)

    if payload["phase"] != previous_phase:
        append_jsonl(
            args.runtime_dir / "monitor.log",
            {
                "event": "phase_change" if previous_phase is not None else "monitor_start",
                "from": previous_phase,
                "to": payload["phase"],
                "at_utc": payload["last_check_at_utc"],
                "at_et": payload["last_check_at_et"],
                "action": payload["phase_action"],
            },
        )
    return payload["phase"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="24h listener for the TSLL application of the power-hour V rebound Path.")
    parser.add_argument("--application-id", default=APPLICATION_ID)
    parser.add_argument("--path-definition-id", default=PATH_DEFINITION_ID)
    parser.add_argument("--target-symbol", default=TARGET_SYMBOL)
    parser.add_argument("--runtime-dir", type=Path, default=DEFAULT_RUNTIME_DIR)
    parser.add_argument("--poll-seconds", type=int, default=30)
    parser.add_argument("--once", action="store_true", help="Write one heartbeat and exit.")
    return parser.parse_args()


def main() -> int:
    signal.signal(signal.SIGTERM, handle_stop)
    signal.signal(signal.SIGINT, handle_stop)

    args = parse_args()
    args.poll_seconds = max(5, args.poll_seconds)
    args.runtime_dir = args.runtime_dir.resolve()

    if not args.once:
        write_pid_file(args.runtime_dir)

    previous_phase = None
    while not SHOULD_STOP:
        previous_phase = record_heartbeat(args, previous_phase)
        if args.once:
            return 0
        time.sleep(args.poll_seconds)

    append_jsonl(
        args.runtime_dir / "monitor.log",
        {
            "event": "monitor_stop",
            "application_id": args.application_id,
            "pid": os.getpid(),
            "at_utc": datetime.now(UTC).isoformat(timespec="seconds"),
        },
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
