#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Test TRMNL MCP server connection using stored credential."""

import argparse
import sys
import json
from pathlib import Path

try:
    import requests
except ImportError:
    sys.stderr.write("Error: requests package required. Install with 'pip install requests'\n")
    sys.exit(1)

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

DEFAULT_NAMESPACE = "trmnl"
DEFAULT_CREDENTIAL_CANDIDATES = [
    "TRMNL_MCP_API_KEY",
    "MCP_API_KEY",
    "api_key",
    "zmanim",
    "parasha",
    "hebdate",
]
MCP_URL = "https://trmnl.com/mcp"

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


def main():
    parser = argparse.ArgumentParser(
        description="Test TRMNL MCP server connection using a shared credential."
    )
    parser.add_argument(
        "credential",
        nargs="?",
        help="Credential name or full namespaced credential, for example 'zmanim' or 'trmnl:zmanim'.",
    )
    parser.add_argument(
        "--namespace",
        default=DEFAULT_NAMESPACE,
        help=f"Credential namespace to search. Default: {DEFAULT_NAMESPACE}",
    )
    args = parser.parse_args()

    credential_name = resolve_credential_name(args.credential, args.namespace)
    api_key = get_credential(credential_name, DEFAULT_SERVICE_NAME)

    print(f"✓ Retrieved credential '{credential_name}'")
    
    # Test MCP connection
    url = f"{MCP_URL}?api_key={api_key}"
    print(f"Testing MCP connection to {MCP_URL}...")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"\n✓ Connection successful!")
        print(f"Status code: {response.status_code}")
        print(f"\nResponse headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        if response.text:
            print(f"\nResponse body (first 500 chars):")
            print(response.text[:500])
            if len(response.text) > 500:
                print(f"... ({len(response.text)} total bytes)")
        
        # Try to parse as JSON if possible
        try:
            data = response.json()
            print(f"\nResponse JSON (pretty):")
            print(json.dumps(data, indent=2)[:500])
        except:
            pass
        
    except requests.exceptions.Timeout:
        print(f"✗ Connection timed out")
        sys.exit(1)
    except requests.exceptions.ConnectionError as e:
        print(f"✗ Connection failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
