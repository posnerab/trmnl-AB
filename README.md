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
- **Paste support** - Multi-line paste when setting credentials
- **Escape at any prompt** - Press `Ctrl+C` to cancel and return to menu
- **View stored credentials** - On load, shows all stored credentials; option to list in menu
- **Context support** - Organize credentials by display name, such as "TRMNL"

Menu options:

1. Set a credential - Save a new credential with optional context
2. Get a credential - Retrieve a stored credential value
3. Delete a credential - Remove a credential with confirmation
4. List stored credentials - View all saved credential names
5. Exit

Install the dependency with:

```bash
pip install keyring
```

Or using the virtual environment:

```bash
source .venv/bin/activate
pip install keyring
```

Use `TRMNL_MCP_API_KEY` with the registered MCP server URL above.

The shared credential toolkit lives at:

- `/home/xander/projects/shared`

This repo can link to it with:

```bash
ln -s /home/xander/projects/shared/credential_manager.py credential_manager.py
```

The TRMNL helper scripts import the shared package from `/home/xander/projects/shared`
directly, so a repo-local `shared_credentials` symlink is no longer required.
