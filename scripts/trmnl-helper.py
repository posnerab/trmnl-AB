#!/usr/bin/env python3
"""General utility helper for TRMNL credentials and MCP operations."""

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
for shared_root in (ROOT.parent / "shared", Path("/home/xander/projects/shared")):
    if shared_root.exists() and str(shared_root) not in sys.path:
        sys.path.insert(0, str(shared_root))

try:
    import requests
except ImportError:
    sys.stderr.write("Error: requests package required. Install with 'pip install requests'\n")
    sys.exit(1)

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential, list_stored_credentials

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


def resolve_credential_name(raw_name=None, namespace=DEFAULT_NAMESPACE):
    """Resolve a short or full credential name within a namespace."""
    if raw_name:
        if ":" in raw_name:
            return raw_name
        return f"{namespace}:{raw_name}"

    credentials = list_stored_credentials(DEFAULT_SERVICE_NAME)
    namespaced = [name for name in credentials if name.startswith(f"{namespace}:")]
    if not namespaced:
        print("No credentials found. Store one first using credential_manager.py")
        sys.exit(1)

    for candidate in DEFAULT_CREDENTIAL_CANDIDATES:
        full_name = f"{namespace}:{candidate}"
        if full_name in namespaced:
            return full_name

    if len(namespaced) == 1:
        return namespaced[0]

    print(
        f"Multiple credentials found in namespace '{namespace}'. "
        f"Pass one explicitly. Available: {', '.join(namespaced)}"
    )
    sys.exit(1)


def test_mcp_connection(credential_name=None):
    """Test MCP connection with a credential."""
    credential_name = resolve_credential_name(credential_name)
    api_key = get_credential(credential_name, DEFAULT_SERVICE_NAME)

    print(f"Using credential: {credential_name}")
    print(f"Testing MCP connection to {MCP_URL}...")

    try:
        response = requests.get(f"{MCP_URL}?api_key={api_key}", timeout=10)

        print(f"\nServer responded with status {response.status_code}")

        if response.status_code == 405:
            print("  (Endpoint expects POST requests)")

        if response.headers.get("allow"):
            print(f"  Allowed methods: {response.headers['allow']}")

        return True

    except requests.exceptions.Timeout:
        print("Connection timed out")
        return False
    except requests.exceptions.ConnectionError as exc:
        print(f"Connection failed: {exc}")
        return False
    except Exception as exc:
        print(f"Error: {exc}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="TRMNL helper utility for credentials and MCP operations"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    get_parser = subparsers.add_parser("get", help="Get a credential value")
    get_parser.add_argument("name", nargs="?", help="Credential short name or full namespaced name")

    subparsers.add_parser("list", help="List all stored credentials")

    test_parser = subparsers.add_parser("test-mcp", help="Test MCP connection")
    test_parser.add_argument(
        "credential",
        nargs="?",
        help="Credential name (optional, uses default if not specified)",
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "get":
        credential_name = resolve_credential_name(args.name)
        value = get_credential(credential_name, DEFAULT_SERVICE_NAME)
        print(value)
    elif args.command == "list":
        creds = list_stored_credentials(DEFAULT_SERVICE_NAME)
        if creds:
            print("Stored credentials:")
            for name in creds:
                print(f"  - {name}")
        else:
            print("No credentials stored.")
    elif args.command == "test-mcp":
        success = test_mcp_connection(args.credential)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
