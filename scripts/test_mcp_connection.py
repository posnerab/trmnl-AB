#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""Test TRMNL MCP server connection using stored credential."""

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
SHARED_ROOT = Path("/home/xander/projects/shared")
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential

CRED_NAME = "TRMNL_MCP_API_KEY"
MCP_URL = "https://trmnl.com/mcp"

def main():
    api_key = get_credential(CRED_NAME, DEFAULT_SERVICE_NAME)
    
    print(f"✓ Retrieved credential '{CRED_NAME}'")
    
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
