#!/usr/bin/env python3
"""
health_check.py — DevOps Practical App Monitor
-----------------------------------------------
Polls the /api/health endpoint, logs response time + status,
and exits with code 1 if the service is unhealthy (useful in CI).

Usage:
    python3 scripts/health_check.py                        # single check
    python3 scripts/health_check.py --watch --interval 30  # continuous monitoring
    python3 scripts/health_check.py --url http://51.20.252.1/api/health
"""

import urllib.request
import urllib.error
import json
import time
import sys
import argparse
import datetime
import os

# ── Colour helpers (no external libraries needed) ──────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def ok(msg):    print(f"{GREEN}✅  {msg}{RESET}")
def err(msg):   print(f"{RED}❌  {msg}{RESET}")
def warn(msg):  print(f"{YELLOW}⚠️   {msg}{RESET}")
def info(msg):  print(f"{CYAN}ℹ️   {msg}{RESET}")


# ── Core check ─────────────────────────────────────────────────────────────────
def check_health(url: str, timeout: int = 5) -> dict:
    """
    Hit the health endpoint and return a result dict.
    Never raises — always returns a result, even on total failure.
    """
    start = time.monotonic()
    result = {
        "url":          url,
        "timestamp":    datetime.datetime.utcnow().isoformat() + "Z",
        "http_status":  None,
        "response_ms":  None,
        "healthy":      False,
        "body":         None,
        "error":        None,
    }

    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            elapsed_ms = int((time.monotonic() - start) * 1000)
            body = json.loads(resp.read().decode())
            result.update({
                "http_status": resp.status,
                "response_ms": elapsed_ms,
                "healthy":     resp.status == 200 and body.get("status") == "ok",
                "body":        body,
            })
    except urllib.error.HTTPError as e:
        elapsed_ms = int((time.monotonic() - start) * 1000)
        result.update({"http_status": e.code, "response_ms": elapsed_ms, "error": str(e)})
    except urllib.error.URLError as e:
        result.update({"error": f"Connection refused / DNS failure: {e.reason}"})
    except Exception as e:
        result.update({"error": str(e)})

    return result


# ── Pretty-print result ─────────────────────────────────────────────────────────
def print_result(r: dict):
    ts    = r["timestamp"]
    url   = r["url"]
    ms    = f"{r['response_ms']} ms" if r["response_ms"] is not None else "—"
    code  = r["http_status"] or "—"

    print(f"\n{BOLD}{'─'*55}{RESET}")
    print(f"  {BOLD}Endpoint :{RESET} {url}")
    print(f"  {BOLD}Time     :{RESET} {ts}")
    print(f"  {BOLD}HTTP     :{RESET} {code}    {BOLD}Latency:{RESET} {ms}")

    if r["healthy"]:
        body = r["body"] or {}
        ok(f"Service HEALTHY  (db: {body.get('database', '?')}, env: {body.get('environment', '?')})")
    else:
        err(f"Service UNHEALTHY")
        if r["error"]:
            warn(f"Error: {r['error']}")
        elif r["body"]:
            warn(f"Response body: {r['body']}")

    print(f"{BOLD}{'─'*55}{RESET}\n")


# ── Log to file ────────────────────────────────────────────────────────────────
def append_log(r: dict, log_path: str = "health_check.log"):
    with open(log_path, "a") as f:
        f.write(json.dumps(r) + "\n")


# ── Entry point ────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="DevOps Practical — Health Check Monitor")
    parser.add_argument("--url",      default="http://51.20.252.1/api/health",
                        help="Health endpoint URL")
    parser.add_argument("--watch",    action="store_true",
                        help="Run continuously instead of a single check")
    parser.add_argument("--interval", type=int, default=30,
                        help="Seconds between checks when --watch is set (default: 30)")
    parser.add_argument("--timeout",  type=int, default=5,
                        help="Request timeout in seconds (default: 5)")
    parser.add_argument("--log",      default="health_check.log",
                        help="Log file path (default: health_check.log)")
    args = parser.parse_args()

    info(f"DevOps Practical — Health Monitor")
    info(f"Target : {args.url}")

    if args.watch:
        info(f"Mode   : continuous (every {args.interval}s) — Ctrl+C to stop\n")
        fail_count = 0
        while True:
            result = check_health(args.url, timeout=args.timeout)
            print_result(result)
            append_log(result, args.log)
            if not result["healthy"]:
                fail_count += 1
                if fail_count >= 3:
                    err(f"3 consecutive failures — service may be down!")
            else:
                fail_count = 0
            try:
                time.sleep(args.interval)
            except KeyboardInterrupt:
                print("\nMonitor stopped.")
                break
    else:
        info(f"Mode   : single check\n")
        result = check_health(args.url, timeout=args.timeout)
        print_result(result)
        append_log(result, args.log)
        sys.exit(0 if result["healthy"] else 1)


if __name__ == "__main__":
    main()
