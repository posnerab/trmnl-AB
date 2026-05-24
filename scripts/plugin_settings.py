#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Query TRMNL MCP IntegrationsShowTool to get current plugin settings."""

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
SHARED_ROOT = Path("/home/xander/projects/shared")
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential

CRED_NAME = "TRMNL_MCP_API_KEY"
MCP_URL = "https://trmnl.com/mcp"


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
    api_key = get_credential(CRED_NAME, DEFAULT_SERVICE_NAME)
    
    print("=" * 70)
    print("TRMNL PLUGIN SETTINGS")
    print("=" * 70)
    print(f"✓ Retrieved API key for {CRED_NAME}\n")
    
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
