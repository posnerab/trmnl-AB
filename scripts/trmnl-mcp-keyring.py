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
for shared_root in (ROOT.parent / "shared", Path("/home/xander/projects/shared")):
    if shared_root.exists() and str(shared_root) not in sys.path:
        sys.path.insert(0, str(shared_root))

from shared_credentials import (
    DEFAULT_SERVICE_NAME,
    build_credential_name,
    get_credential,
    list_stored_credentials,
)

MCP_URL = "https://trmnl.com/mcp"
DEFAULT_NAMESPACE = "trmnl"
DEFAULT_CREDENTIAL_CANDIDATES = [
    "TRMNL_MCP_API_KEY",
    "MCP_API_KEY",
    "api_key",
    "zmanim",
    "parasha",
    "hebdate",
]


def resolve_credential_name(raw_name: str | None, namespace: str) -> str:
    if raw_name:
        if ":" in raw_name:
            return raw_name
        return build_credential_name(raw_name, namespace)

    stored = list_stored_credentials(DEFAULT_SERVICE_NAME)
    namespaced = [name for name in stored if name.startswith(f"{namespace}:")]

    for candidate in DEFAULT_CREDENTIAL_CANDIDATES:
        full_name = build_credential_name(candidate, namespace)
        if full_name in namespaced:
            return full_name

    if len(namespaced) == 1:
        return namespaced[0]

    if namespaced:
        available = ", ".join(namespaced)
        raise SystemExit(
            f"Multiple credentials found in namespace '{namespace}'. "
            f"Pass one explicitly. Available: {available}"
        )

    raise SystemExit(
        f"No credentials found in namespace '{namespace}'. "
        "Use credential_manager.py to add one first."
    )


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
        nargs="?",
        help="Credential name or full namespaced credential, for example 'zmanim' or 'trmnl:zmanim'.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check that the credential and npx launcher are available without starting MCP.",
    )
    parser.add_argument(
        "--namespace",
        default=DEFAULT_NAMESPACE,
        help=f"Credential namespace to search. Default: {DEFAULT_NAMESPACE}",
    )
    args = parser.parse_args()

    credential_name = resolve_credential_name(args.credential, args.namespace)
    api_key = get_credential(credential_name, DEFAULT_SERVICE_NAME)
    npx = find_npx()

    if args.check:
        print(f"OK: credential '{credential_name}' exists and npx is available at {npx}")
        return

    url = f"{MCP_URL}?api_key={quote(api_key, safe='')}"
    os.execvp(npx, [npx, "-y", "mcp-remote", url])


if __name__ == "__main__":
    main()
