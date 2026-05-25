#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Query TRMNL MCP IntegrationsShowTool to get current plugin settings."""

import argparse
import sys
import json
from pathlib import Path

try:
    import requests
except ImportError:
    sys.stderr.write("Error: Required packages missing. Install with 'pip install keyring requests'\n")
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


def call_tool(api_key, tool_name, tool_input):
    """Call a tool via MCP."""
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": tool_input
        }
    }
    
    try:
        response = requests.post(
            f"{MCP_URL}?api_key={api_key}",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Tool call failed with status {response.status_code}")
            if response.text:
                print(f"Response: {response.text[:500]}")
            return None
    
    except Exception as e:
        print(f"✗ Error calling tool: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Query TRMNL plugin settings using a shared credential."
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
    
    print("=" * 70)
    print("TRMNL PLUGIN SETTINGS")
    print("=" * 70)
    print(f"✓ Retrieved API key for {credential_name}\n")
    
    # Call IntegrationsShowTool to get plugin settings
    print("Querying IntegrationsShowTool for current plugin settings...\n")
    
    result = call_tool(api_key, "IntegrationsShowTool", {})
    
    if result:
        print(json.dumps(result, indent=2))
        
        # Extract the content if it exists
        if "result" in result and "content" in result["result"]:
            content = result["result"]["content"]
            for item in content:
                if item.get("type") == "text":
                    print(f"\n{item.get('text', '')}")
    
    # Also query MergeVariablesShowTool to see available template variables
    print("\n" + "=" * 70)
    print("AVAILABLE LIQUID TEMPLATE VARIABLES")
    print("=" * 70 + "\n")
    
    print("Querying MergeVariablesShowTool...\n")
    
    result = call_tool(api_key, "MergeVariablesShowTool", {})
    
    if result:
        if "result" in result and "content" in result["result"]:
            content = result["result"]["content"]
            for item in content:
                if item.get("type") == "text":
                    print(f"{item.get('text', '')}")
        else:
            print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
