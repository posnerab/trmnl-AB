#!/Users/abieposner/Documents/trmnl-AB/.venv/bin/python3
"""General utility helper for TRMNL credentials and MCP operations."""

import sys
import os
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
SHARED_ROOT = Path("/home/xander/projects/shared")
if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

try:
    import requests
except ImportError:
    sys.stderr.write("Error: requests package required. Install with 'pip install requests'\n")
    sys.exit(1)

from shared_credentials import DEFAULT_SERVICE_NAME, get_credential, list_stored_credentials

MCP_URL = "https://trmnl.com/mcp"


def test_mcp_connection(credential_name=None):
    """Test MCP connection with a credential."""
    # If no credential name provided, look for default or ask
    if not credential_name:
        credentials = list_stored_credentials(DEFAULT_SERVICE_NAME)
        if not credentials:
            print("✗ No credentials found. Store one first using credential_manager.py")
            sys.exit(1)
        
        if "TRMNL_MCP_API_KEY" in credentials:
            credential_name = "TRMNL_MCP_API_KEY"
        else:
            credential_name = credentials[0]
    
    # Retrieve and test
    api_key = get_credential(credential_name, DEFAULT_SERVICE_NAME)
    
    print(f"✓ Using credential: {credential_name}")
    print(f"Testing MCP connection to {MCP_URL}...")
    
    try:
        response = requests.get(f"{MCP_URL}?api_key={api_key}", timeout=10)
        
        print(f"\n✓ Server responded with status {response.status_code}")
        
        if response.status_code == 405:
            print("  (Endpoint expects POST requests)")
        
        if response.headers.get("allow"):
            print(f"  Allowed methods: {response.headers['allow']}")
        
        return True
        
    except requests.exceptions.Timeout:
        print("✗ Connection timed out")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"✗ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="TRMNL helper utility for credentials and MCP operations"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # get command
    get_parser = subparsers.add_parser("get", help="Get a credential value")
    get_parser.add_argument("name", help="Credential name")
    
    # list command
    subparsers.add_parser("list", help="List all stored credentials")
    
    # test-mcp command
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
        value = get_credential(args.name, DEFAULT_SERVICE_NAME)
        print(value)
    elif args.command == "list":
        creds = list_stored_credentials(DEFAULT_SERVICE_NAME)
        if creds:
            print("Stored credentials:")
            for name in creds:
                print(f"  • {name}")
        else:
            print("No credentials stored.")
    elif args.command == "test-mcp":
        success = test_mcp_connection(args.credential)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
