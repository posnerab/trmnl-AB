#!/usr/bin/env python3
"""Compatibility launcher for the shared credential manager."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SHARED_ROOT = ROOT.parent / "shared"

if str(SHARED_ROOT) not in sys.path:
    sys.path.insert(0, str(SHARED_ROOT))

from credential_manager import main  # type: ignore  # noqa: E402


if __name__ == "__main__":
    main()
