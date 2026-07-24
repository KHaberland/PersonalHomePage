#!/usr/bin/env python3
"""Pre-commit hook: block committing local env files with secrets."""

from __future__ import annotations

import sys
from pathlib import PurePosixPath

ALLOWED = {".env.example"}

BLOCKED_NAMES = {
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.test.local",
    ".env.production.local",
}


def is_blocked(path: str) -> bool:
    name = PurePosixPath(path.replace("\\", "/")).name
    if name in ALLOWED:
        return False
    if name in BLOCKED_NAMES:
        return True
    if name.startswith(".env.") and name.endswith(".local"):
        return True
    return False


def main(argv: list[str]) -> int:
    blocked = [path for path in argv if is_blocked(path)]
    if not blocked:
        return 0

    print("ERROR: Do not commit local env files with secrets:")
    for path in blocked:
        print(f"  - {path}")
    print("Use .env.example for templates; keep .env local only.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
