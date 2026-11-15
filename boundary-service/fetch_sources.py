#!/usr/bin/env python3
"""Read only the existing merged source data. Credentials never leave this process."""
import json
import os
import sys
import requests
from shared_credentials import get_credential

# A dedicated account key can refresh the merged dependency chain before reading.
# Do not automatically fall back to a legacy key or replay an uncertain refresh.
if os.environ.get('TRMNL_REFRESH_ALIAS'):
    token = get_credential(os.environ['TRMNL_REFRESH_ALIAS'])
    try:
        response = requests.post('https://trmnl.com/api/plugin_settings/140532/refreshes',
            json={}, headers={'Authorization': 'Bearer ' + token}, timeout=20)
        response.raise_for_status()
    except Exception:
        print('TRMNL source refresh unavailable', file=sys.stderr)
        # An ambiguous submission is not replayed; read the available data.
key = get_credential('trmnl:zmanim')
try:
    response = requests.post('https://trmnl.com/mcp', params={'api_key': key},
        json={'jsonrpc':'2.0','id':1,'method':'tools/call','params': {
            'name':'MergeVariablesShowTool','arguments':{}}}, timeout=25)
    response.raise_for_status()
    result = response.json()
    content = result['result']['content']
    data = json.loads(next(c['text'] for c in content if c['type'] == 'text'))
    raw = data['transform_raw_input']
    # No account/device metadata or plugin configuration is needed by the renderer.
    allowed = {k: raw[k] for k in ('weather_140203', 'lunar_calendar_141216') if k in raw}
    if 'private_plugin_384908' in raw:
        allowed['private_plugin_384908'] = {'merge_variables': raw['private_plugin_384908'].get('merge_variables', {})}
    print(json.dumps(allowed))
except Exception:
    print('TRMNL source read unavailable', file=sys.stderr)
    sys.exit(1)
