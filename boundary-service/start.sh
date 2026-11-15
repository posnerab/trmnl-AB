#!/bin/bash
set -euo pipefail
# The existing credential unlock file uses shell export syntax. Never give it
# to systemd EnvironmentFile, which logs invalid assignments including values.
set -a
source /home/xander/.shared-credentials.env
set +a
exec /usr/bin/node /usr/local/lib/trmnl-boundary/boundary-service/server.cjs
