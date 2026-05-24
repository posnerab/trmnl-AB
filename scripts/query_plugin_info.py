#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Query TRMNL MCP for plugin information."""

import argparse
import sys
import json
from pathlib import Path

try:
    import requests
except ImportError:
    sys.stderr.write(f"Error: Required package missing. Install with 'pip install keyring requests'\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
SHARED_ROOT = Path("/home/xander/projects/shared")
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

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


def query_mcp_plugin_info(api_key):
    """Query MCP for plugin information.
    
    Standard MCP protocol uses JSON-RPC 2.0 format.
    """
    
    headers = {
        "Content-Type": "application/json",
    }
    
    # First, query resources
    print(f"Querying TRMNL MCP for plugin information...")
    print(f"Endpoint: {MCP_URL}\n")
    
    all_data = {}
    
    # Get resources
    print("=" * 50)
    print("Resources")
    print("=" * 50)
    
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "resources/list",
    }
    
    try:
        response = requests.post(
            f"{MCP_URL}?api_key={api_key}",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "result" in data and "resources" in data["result"]:
                resources = data["result"]["resources"]
                all_data["resources"] = resources
                for resource in resources:
                    print(f"\nName: {resource.get('name', 'N/A')}")
                    print(f"URI: {resource.get('uri', 'N/A')}")
                    print(f"Description: {resource.get('description', 'N/A')}")
        else:
            print(f"✗ Failed to get resources (status: {response.status_code})")
    
    except Exception as e:
        print(f"✗ Error querying resources: {e}")
    
    # Get tools
    print("\n" + "=" * 50)
    print("Tools")
    print("=" * 50)
    
    payload = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/list",
    }
    
    try:
        response = requests.post(
            f"{MCP_URL}?api_key={api_key}",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "result" in data and "tools" in data["result"]:
                tools = data["result"]["tools"]
                all_data["tools"] = tools
                for tool in tools:
                    print(f"\nName: {tool.get('name', 'N/A')}")
                    print(f"Description: {tool.get('description', 'N/A')}")
            else:
                print("No tools available")
        else:
            print(f"✗ Failed to get tools (status: {response.status_code})")
    
    except Exception as e:
        print(f"✗ Error querying tools: {e}")
    
    # Get prompts
    print("\n" + "=" * 50)
    print("Prompts")
    print("=" * 50)
    
    payload = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "prompts/list",
    }
    
    try:
        response = requests.post(
            f"{MCP_URL}?api_key={api_key}",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "result" in data and "prompts" in data["result"]:
                prompts = data["result"]["prompts"]
                all_data["prompts"] = prompts
                for prompt in prompts:
                    print(f"\nName: {prompt.get('name', 'N/A')}")
                    print(f"Description: {prompt.get('description', 'N/A')}")
            else:
                print("No prompts available")
        else:
            print(f"✗ Failed to get prompts (status: {response.status_code})")
    
    except Exception as e:
        print(f"✗ Error querying prompts: {e}")
    
    print("\n" + "=" * 50)
    print("Full Response (JSON)")
    print("=" * 50)
    print(json.dumps(all_data, indent=2))
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Query TRMNL MCP resources, tools, and prompts using a shared credential."
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
    print(f"✓ Retrieved API key for {credential_name}\n")
    
    success = query_mcp_plugin_info(api_key)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
