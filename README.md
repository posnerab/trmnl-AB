# ab-trmnl

Shared development repo for TRMNL e-ink display projects.

## Notes

Deployment secrets, generated Python bytecode, and machine-specific editor files are intentionally excluded.

## Scripts

Helper scripts are in the `scripts/` directory:

- `trmnl-helper.py` - General utility for credentials and MCP operations
- `test_mcp_connection.py` - Detailed MCP connection testing

See [scripts/README.md](scripts/README.md) for usage.

## MCP and Credentials

A persistent MCP server registration is stored in repo memory at `/memories/repo/mcp_servers.json`:

```json
{
  "mcpServers": {
    "trmnl": {
      "type": "http",
      "url": "https://trmnl.com/mcp?api_key=${TRMNL_MCP_API_KEY}"
    }
  }
}
```

A shared credential manager is linked into this repo at `credential_manager.py`.
The actual source lives outside this repo so it can be reused across projects.

Features:

- **Menu-driven interface** - Run `./credential_manager.py` or `python credential_manager.py`
- **Single-line secret entry** - Paste a key and press Enter to save it
- **Escape at any prompt** - Press `Ctrl+C` to cancel and return to menu
- **View stored credentials** - The main menu shows currently stored credentials
- **Namespace support** - Organize credentials by namespace, such as `trmnl:zmanim`

Menu options:

1. Set a credential - Save a new credential with optional context
2. Get a credential - Retrieve a stored credential value
3. Delete a credential - Remove a credential with confirmation
4. Exit

Install dependencies with:

```bash
pip install -r /home/xander/projects/shared/requirements.txt
```

Or use the shared virtual environment:

```bash
source /home/xander/projects/shared/.venv/bin/activate
```

The shared credential toolkit lives at:

- `/home/xander/projects/shared`

This repo can link to it with:

```bash
ln -s /home/xander/projects/shared/credential_manager.py credential_manager.py
```

The TRMNL helper scripts import the shared package from `/home/xander/projects/shared`
directly, so a repo-local `shared_credentials` symlink is no longer required.

For non-interactive unlocks, set:

```bash
export SHARED_CREDENTIALS_MASTER_PASSWORD='your-keyring-password'
```

Typical local setup:

```bash
source ~/.shared-credentials.env
```
