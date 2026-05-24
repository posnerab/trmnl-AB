# Scripts

Utility scripts for TRMNL credential and MCP management.

## `trmnl-helper.py`

General utility for credentials and MCP operations.

### Commands

**List stored credentials:**
```bash
python scripts/trmnl-helper.py list
```

**Get a credential value:**
```bash
python scripts/trmnl-helper.py get TRMNL_MCP_API_KEY
```

**Test MCP connection:**
```bash
python scripts/trmnl-helper.py test-mcp [credential-name]
```

If credential name is omitted, defaults to looking for `TRMNL_MCP_API_KEY` or first available credential.

Examples:
```bash
python scripts/trmnl-helper.py test-mcp
python scripts/trmnl-helper.py test-mcp TRMNL_MCP_API_KEY
```

## `test_mcp_connection.py`

Standalone script for detailed MCP connection testing with a specific credential.

```bash
python scripts/test_mcp_connection.py
```

This script retrieves the `TRMNL_MCP_API_KEY` credential and performs a full connection test with response details.

## Usage Notes

- All scripts use the `.venv` Python interpreter automatically via shebang
- Credentials are retrieved from the shared keyring helper linked into the repo
- Run from the repo root: `python scripts/trmnl-helper.py [command]`
