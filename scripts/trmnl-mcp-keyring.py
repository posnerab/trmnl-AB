#!/usr/bin/env python3
"""Launch TRMNL MCP using an API key stored in the OS keyring."""

import argparse
import os
import shutil
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
SHARED_ROOT = Path("/home/xander/projects/shared")
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential

MCP_URL = "https://trmnl.com/mcp"


def find_npx() -> str:
    local_bin = os.path.expanduser("~/.local/bin")
    os.environ["PATH"] = f"{local_bin}:{os.environ.get('PATH', '')}"

    npx = shutil.which("npx")
    if not npx:
        sys.stderr.write(
            "Error: npx was not found. Install Node.js/npm, then retry this MCP launcher.\n"
        )
        sys.exit(1)

    return npx


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Launch TRMNL MCP through mcp-remote with a keyring credential."
    )
    parser.add_argument(
        "credential",
        help="Keyring credential name, for example TRMNL_MCP_API_KEY.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check that the credential and npx launcher are available without starting MCP.",
    )
    args = parser.parse_args()

    api_key = get_credential(args.credential, DEFAULT_SERVICE_NAME)
    npx = find_npx()

    if args.check:
        print(f"OK: credential '{args.credential}' exists and npx is available at {npx}")
        return

    url = f"{MCP_URL}?api_key={quote(api_key, safe='')}"
    os.execvp(npx, [npx, "-y", "mcp-remote", url])


if __name__ == "__main__":
    main()
