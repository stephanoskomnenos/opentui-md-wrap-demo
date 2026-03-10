#!/usr/bin/env bash
set -euo pipefail

START_COLS="${1:-36}"
END_COLS="${2:-50}"

for ((w=START_COLS; w<=END_COLS; w++)); do
  ./scripts/capture.sh --tmux-columns "$w" --out-png "./tmp/demo-${w}.png"
done
