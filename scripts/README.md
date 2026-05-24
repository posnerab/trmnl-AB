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
python scripts/trmnl-helper.py get zmanim
```

**Test MCP connection:**
```bash
python scripts/trmnl-helper.py test-mcp [credential-name]
```

If credential name is omitted, defaults to the best match in the `trmnl` namespace.

Examples:
```bash
python scripts/trmnl-helper.py test-mcp
python scripts/trmnl-helper.py test-mcp zmanim
python scripts/trmnl-helper.py test-mcp trmnl:parasha
```

## `test_mcp_connection.py`

Standalone script for detailed MCP connection testing with a specific credential.

```bash
python scripts/test_mcp_connection.py
python scripts/test_mcp_connection.py zmanim
```

This script retrieves a credential from the `trmnl` namespace and performs a full connection test with response details.

## Usage Notes

- All scripts use the `.venv` Python interpreter automatically via shebang
- Credentials are retrieved from the shared keyring helper linked into the repo
- Non-interactive unlocks use `SHARED_CREDENTIALS_MASTER_PASSWORD`
- Run from the repo root: `python scripts/trmnl-helper.py [command]`
