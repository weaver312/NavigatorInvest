#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8769}"
DB_PATH="${DB_PATH:-$APP_DIR/data/path_harness.sqlite}"

python3 backend/server.py --host "$HOST" --port "$PORT" --db "$DB_PATH"
