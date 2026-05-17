#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import mimetypes
import sqlite3
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

APP_VERSION = "0.1 alpha"
ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DEFAULT_DB_PATH = DATA_DIR / "path_harness.sqlite"
SEED_PATH = DATA_DIR / "seed_data.json"

ENTITY_TABLES = {
    "horizontal_coordinate": {
        "seed_key": "horizontalDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "horizontal_coordinate_occurrence": {
        "seed_key": "horizontalOccurrenceRows",
        "id_field": "occurrence_id",
        "fk": {"coordinate_id": ("horizontal_coordinate", "id")},
    },
    "vertical_coordinate": {
        "seed_key": "verticalDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "vertical_coordinate_occurrence": {
        "seed_key": "verticalOccurrenceRows",
        "id_field": "occurrence_id",
        "fk": {"coordinate_id": ("vertical_coordinate", "id")},
    },
    "path_definition": {
        "seed_key": "pathDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "path_application": {
        "seed_key": "pathApplicationRows",
        "id_field": "application_id",
        "fk": {"path_definition_id": ("path_definition", "id")},
    },
    "path_instance": {
        "seed_key": "pathInstanceRows",
        "id_field": "instance_id",
        "fk": {"path_definition_id": ("path_definition", "id")},
    },
    "consumer_channel_definition": {
        "seed_key": "consumerChannelDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "signal_consumption_record": {
        "seed_key": "signalConsumptionRecordRows",
        "id_field": "record_id",
        "fk": {"channel_id": ("consumer_channel_definition", "id")},
    },
    "llm_api_definition": {
        "seed_key": "llmApiDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "ai_agent_instance": {
        "seed_key": "aiAgentInstanceRows",
        "id_field": "agent_id",
        "fk": {"llm_definition_id": ("llm_api_definition", "id")},
    },
    "data_source_definition": {
        "seed_key": "dataSourceDefinitionRows",
        "id_field": "id",
        "fk": {},
    },
    "symbol_data_map": {
        "seed_key": "symbolDataMapRows",
        "id_field": "symbol",
        "fk": {},
    },
}

BOOTSTRAP_KEYS = {
    "horizontal_coordinate": "horizontalDefinitionRows",
    "horizontal_coordinate_occurrence": "horizontalOccurrenceRows",
    "vertical_coordinate": "verticalDefinitionRows",
    "vertical_coordinate_occurrence": "verticalOccurrenceRows",
    "path_definition": "pathDefinitionRows",
    "path_application": "pathApplicationRows",
    "path_instance": "pathInstanceRows",
    "consumer_channel_definition": "consumerChannelDefinitionRows",
    "signal_consumption_record": "signalConsumptionRecordRows",
    "llm_api_definition": "llmApiDefinitionRows",
    "ai_agent_instance": "aiAgentInstanceRows",
    "data_source_definition": "dataSourceDefinitionRows",
    "symbol_data_map": "symbolDataMapRows",
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS app_meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS horizontal_coordinate (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS horizontal_coordinate_occurrence (
          occurrence_id TEXT PRIMARY KEY,
          coordinate_id TEXT NOT NULL REFERENCES horizontal_coordinate(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS vertical_coordinate (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS vertical_coordinate_occurrence (
          occurrence_id TEXT PRIMARY KEY,
          coordinate_id TEXT NOT NULL REFERENCES vertical_coordinate(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS path_definition (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS path_application (
          application_id TEXT PRIMARY KEY,
          path_definition_id TEXT NOT NULL REFERENCES path_definition(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS path_instance (
          instance_id TEXT PRIMARY KEY,
          path_definition_id TEXT NOT NULL REFERENCES path_definition(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS consumer_channel_definition (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS signal_consumption_record (
          record_id TEXT PRIMARY KEY,
          channel_id TEXT NOT NULL REFERENCES consumer_channel_definition(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS llm_api_definition (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ai_agent_instance (
          agent_id TEXT PRIMARY KEY,
          llm_definition_id TEXT NOT NULL REFERENCES llm_api_definition(id),
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS data_source_definition (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS symbol_data_map (
          symbol TEXT PRIMARY KEY,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS symbol_dataset_coverage (
          symbol TEXT NOT NULL REFERENCES symbol_data_map(symbol),
          domain TEXT NOT NULL,
          payload TEXT NOT NULL CHECK (json_valid(payload)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (symbol, domain)
        );
        """
    )
    conn.commit()


def read_seed() -> dict:
    if not SEED_PATH.exists():
        raise FileNotFoundError(f"Seed data not found: {SEED_PATH}")
    return json.loads(SEED_PATH.read_text(encoding="utf-8"))


def table_is_empty(conn: sqlite3.Connection, table: str) -> bool:
    row = conn.execute(f"SELECT COUNT(*) AS count FROM {table}").fetchone()
    return int(row["count"]) == 0


def insert_payload(conn: sqlite3.Connection, table: str, id_field: str, row: dict) -> None:
    if id_field not in row or not str(row[id_field]).strip():
        raise ValueError(f"{table} row missing primary key field {id_field}")
    now = utc_now()
    payload = json.dumps(row, ensure_ascii=False, separators=(",", ":"))
    conn.execute(
        f"""
        INSERT INTO {table} ({id_field}, payload, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT({id_field}) DO UPDATE SET
          payload = excluded.payload,
          updated_at = excluded.updated_at
        """,
        (row[id_field], payload, now, now),
    )


def insert_payload_with_fk(
    conn: sqlite3.Connection,
    table: str,
    id_field: str,
    fk_fields: dict[str, tuple[str, str]],
    row: dict,
) -> None:
    if not fk_fields:
        insert_payload(conn, table, id_field, row)
        return
    if id_field not in row or not str(row[id_field]).strip():
        raise ValueError(f"{table} row missing primary key field {id_field}")
    for fk_field, (target_table, target_id_field) in fk_fields.items():
        value = row.get(fk_field)
        if not value:
            raise ValueError(f"{table}.{fk_field} is required")
        exists = conn.execute(
            f"SELECT 1 FROM {target_table} WHERE {target_id_field} = ?",
            (value,),
        ).fetchone()
        if not exists:
            raise ValueError(f"{table}.{fk_field} points to missing {target_table}: {value}")
    now = utc_now()
    payload = json.dumps(row, ensure_ascii=False, separators=(",", ":"))
    columns = [id_field, *fk_fields.keys(), "payload", "created_at", "updated_at"]
    values = [row[id_field], *[row[field] for field in fk_fields], payload, now, now]
    update_fields = ", ".join([f"{field} = excluded.{field}" for field in [*fk_fields.keys(), "payload", "updated_at"]])
    placeholders = ", ".join(["?"] * len(columns))
    conn.execute(
        f"""
        INSERT INTO {table} ({", ".join(columns)})
        VALUES ({placeholders})
        ON CONFLICT({id_field}) DO UPDATE SET {update_fields}
        """,
        values,
    )


def seed_database(conn: sqlite3.Connection, reset: bool = False) -> None:
    seed = read_seed()
    if reset:
        for table in ["symbol_dataset_coverage", *reversed(list(ENTITY_TABLES.keys()))]:
            conn.execute(f"DELETE FROM {table}")
        conn.execute("DELETE FROM app_meta")

    # Definitions first, then dependent instance tables.
    load_order = [
        "horizontal_coordinate",
        "vertical_coordinate",
        "path_definition",
        "path_application",
        "consumer_channel_definition",
        "llm_api_definition",
        "data_source_definition",
        "symbol_data_map",
        "horizontal_coordinate_occurrence",
        "vertical_coordinate_occurrence",
        "path_instance",
        "signal_consumption_record",
        "ai_agent_instance",
    ]
    for table in load_order:
        if not reset and not table_is_empty(conn, table):
            continue
        cfg = ENTITY_TABLES[table]
        for row in seed.get(cfg["seed_key"], []):
            insert_payload_with_fk(conn, table, cfg["id_field"], cfg["fk"], row)
            if table == "symbol_data_map":
                upsert_symbol_datasets(conn, row)

    now = utc_now()
    conn.execute(
        """
        INSERT INTO app_meta (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        """,
        ("version", APP_VERSION, now),
    )
    conn.execute(
        """
        INSERT INTO app_meta (key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        """,
        ("seeded_at", now, now),
    )
    conn.commit()


def upsert_symbol_datasets(conn: sqlite3.Connection, symbol_row: dict) -> None:
    symbol = symbol_row["symbol"]
    for dataset in symbol_row.get("datasets", []):
        domain = dataset.get("domain")
        if not domain:
            continue
        now = utc_now()
        conn.execute(
            """
            INSERT INTO symbol_dataset_coverage (symbol, domain, payload, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(symbol, domain) DO UPDATE SET
              payload = excluded.payload,
              updated_at = excluded.updated_at
            """,
            (symbol, domain, json.dumps(dataset, ensure_ascii=False, separators=(",", ":")), now, now),
        )


def payload_rows(conn: sqlite3.Connection, table: str, order_field: str) -> list[dict]:
    rows = conn.execute(f"SELECT payload FROM {table} ORDER BY {order_field}").fetchall()
    return [json.loads(row["payload"]) for row in rows]


def bootstrap_payload(conn: sqlite3.Connection, db_path: Path) -> dict:
    data = {
        "meta": {
            "version": APP_VERSION,
            "db_path": str(db_path),
            "generated_at": utc_now(),
        }
    }
    for table, key in BOOTSTRAP_KEYS.items():
        cfg = ENTITY_TABLES[table]
        data[key] = payload_rows(conn, table, cfg["id_field"])
    return data


def health_payload(conn: sqlite3.Connection, db_path: Path) -> dict:
    counts = {}
    for table, cfg in ENTITY_TABLES.items():
        row = conn.execute(f"SELECT COUNT(*) AS count FROM {table}").fetchone()
        counts[table] = int(row["count"])
    dataset_count = conn.execute("SELECT COUNT(*) AS count FROM symbol_dataset_coverage").fetchone()
    counts["symbol_dataset_coverage"] = int(dataset_count["count"])
    return {
        "status": "ok",
        "version": APP_VERSION,
        "db_path": str(db_path),
        "counts": counts,
        "checked_at": utc_now(),
    }


class PathHarnessHandler(SimpleHTTPRequestHandler):
    server_version = "PathHarnessBackend/0.1alpha"

    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def db_path(self) -> Path:
        return self.server.db_path  # type: ignore[attr-defined]

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self.handle_api_get(parsed.path)
            return
        if parsed.path == "/":
            self.path = "/index.html"
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/entities/"):
            self.handle_entity_upsert(parsed.path)
            return
        self.send_json({"error": "not_found"}, HTTPStatus.NOT_FOUND)

    def handle_api_get(self, path_value: str) -> None:
        try:
            with connect(self.db_path) as conn:
                if path_value == "/api/health":
                    self.send_json(health_payload(conn, self.db_path))
                    return
                if path_value == "/api/bootstrap":
                    self.send_json(bootstrap_payload(conn, self.db_path))
                    return
                if path_value.startswith("/api/entities/"):
                    parts = [unquote(part) for part in path_value.split("/") if part]
                    if len(parts) not in (3, 4):
                        self.send_json({"error": "bad_entity_path"}, HTTPStatus.BAD_REQUEST)
                        return
                    table = parts[2]
                    if table not in ENTITY_TABLES:
                        self.send_json({"error": "unknown_entity", "table": table}, HTTPStatus.NOT_FOUND)
                        return
                    cfg = ENTITY_TABLES[table]
                    if len(parts) == 3:
                        self.send_json({"rows": payload_rows(conn, table, cfg["id_field"])})
                        return
                    record_id = parts[3]
                    row = conn.execute(
                        f"SELECT payload FROM {table} WHERE {cfg['id_field']} = ?",
                        (record_id,),
                    ).fetchone()
                    if not row:
                        self.send_json({"error": "not_found", "id": record_id}, HTTPStatus.NOT_FOUND)
                        return
                    self.send_json(json.loads(row["payload"]))
                    return
            self.send_json({"error": "not_found"}, HTTPStatus.NOT_FOUND)
        except Exception as exc:  # pragma: no cover - visible alpha diagnostics
            self.send_json({"error": "api_error", "message": str(exc)}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_entity_upsert(self, path_value: str) -> None:
        try:
            parts = [unquote(part) for part in path_value.split("/") if part]
            if len(parts) != 3:
                self.send_json({"error": "bad_entity_path"}, HTTPStatus.BAD_REQUEST)
                return
            table = parts[2]
            if table not in ENTITY_TABLES:
                self.send_json({"error": "unknown_entity", "table": table}, HTTPStatus.NOT_FOUND)
                return
            content_length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(body)
            if not isinstance(payload, dict):
                self.send_json({"error": "payload_must_be_object"}, HTTPStatus.BAD_REQUEST)
                return
            cfg = ENTITY_TABLES[table]
            with connect(self.db_path) as conn:
                insert_payload_with_fk(conn, table, cfg["id_field"], cfg["fk"], payload)
                if table == "symbol_data_map":
                    upsert_symbol_datasets(conn, payload)
                conn.commit()
            self.send_json({"status": "ok", "table": table, "id": payload[cfg["id_field"]]})
        except ValueError as exc:
            self.send_json({"error": "validation_error", "message": str(exc)}, HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover - visible alpha diagnostics
            self.send_json({"error": "api_error", "message": str(exc)}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header("X-Path-Harness-Version", APP_VERSION)
        super().end_headers()


def ensure_backend(db_path: Path, reset: bool = False) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with connect(db_path) as conn:
        init_schema(conn)
        seed_database(conn, reset=reset)


def run(host: str, port: int, db_path: Path) -> None:
    ensure_backend(db_path)
    mimetypes.add_type("application/javascript", ".js")
    httpd = ThreadingHTTPServer((host, port), PathHarnessHandler)
    httpd.db_path = db_path  # type: ignore[attr-defined]
    print(f"Path Harness {APP_VERSION} serving http://{host}:{port}/")
    print(f"SQLite database: {db_path}")
    httpd.serve_forever()


def main() -> None:
    parser = argparse.ArgumentParser(description="Path Harness 0.1 alpha backend")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8769, type=int)
    parser.add_argument("--db", default=str(DEFAULT_DB_PATH))
    parser.add_argument("--reset-db", action="store_true", help="Reset and reseed the SQLite database, then exit unless --serve is set.")
    parser.add_argument("--serve", action="store_true", help="Serve after --reset-db.")
    args = parser.parse_args()

    db_path = Path(args.db).expanduser().resolve()
    if args.reset_db:
        ensure_backend(db_path, reset=True)
        if not args.serve:
            print(f"Reset database: {db_path}")
            return
    run(args.host, args.port, db_path)


if __name__ == "__main__":
    main()
