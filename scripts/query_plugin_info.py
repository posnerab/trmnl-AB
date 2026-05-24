#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Query TRMNL MCP for plugin information."""

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

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential

CRED_NAME = "TRMNL_MCP_API_KEY"
MCP_URL = "https://trmnl.com/mcp"


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
    api_key = get_credential(CRED_NAME, DEFAULT_SERVICE_NAME)
    print(f"✓ Retrieved API key\n")
    
    success = query_mcp_plugin_info(api_key)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
