#!/usr/bin/env bash
set -euo pipefail

TMUX_SOCKET="opentui_md_demo"
SESSION_NAME="opentui_md_demo"
TMUX_COLUMNS="43"
TMUX_ROWS="40"
CAPTURE_DELAY_SECONDS="1.0"
OUT_PNG="./tmp/demo-43.png"
CHAR_PX="8"
PNG_WIDTH=""
TMUX_TMPDIR="${TMPDIR:-/tmp}"
SANDBOX_HOME="${TMUX_TMPDIR}/opentui-md-demo-home"

usage() {
  cat <<'EOF'
Usage:
  scripts/capture.sh [options]
Options:
  --tmux-columns <num>      tmux width (default: 43)
  --tmux-rows <num>         tmux height (default: 40)
  --capture-delay <seconds> delay before capture (default: 1.0)
  --out-png <path>          output png path (default: ./tmp/demo-43.png)
  --char-px <num>           char pixel width for html render (default: 8)
  --png-width <num>         override rendered png width
  --tmux-tmpdir <path>      tmux temporary directory
  --sandbox-home <path>     sandbox HOME for demo process
  --help                    print this help
EOF
}

parse_options() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --tmux-columns)
        [[ $# -ge 2 ]] || { echo '--tmux-columns requires a value' >&2; exit 1; }
        TMUX_COLUMNS="$2"
        shift 2
        ;;
      --tmux-rows)
        [[ $# -ge 2 ]] || { echo '--tmux-rows requires a value' >&2; exit 1; }
        TMUX_ROWS="$2"
        shift 2
        ;;
      --capture-delay)
        [[ $# -ge 2 ]] || { echo '--capture-delay requires a value' >&2; exit 1; }
        CAPTURE_DELAY_SECONDS="$2"
        shift 2
        ;;
      --out-png)
        [[ $# -ge 2 ]] || { echo '--out-png requires a value' >&2; exit 1; }
        OUT_PNG="$2"
        shift 2
        ;;
      --char-px)
        [[ $# -ge 2 ]] || { echo '--char-px requires a value' >&2; exit 1; }
        CHAR_PX="$2"
        shift 2
        ;;
      --png-width)
        [[ $# -ge 2 ]] || { echo '--png-width requires a value' >&2; exit 1; }
        PNG_WIDTH="$2"
        shift 2
        ;;
      --tmux-tmpdir)
        [[ $# -ge 2 ]] || { echo '--tmux-tmpdir requires a value' >&2; exit 1; }
        TMUX_TMPDIR="$2"
        shift 2
        ;;
      --sandbox-home)
        [[ $# -ge 2 ]] || { echo '--sandbox-home requires a value' >&2; exit 1; }
        SANDBOX_HOME="$2"
        shift 2
        ;;
      --help)
        usage
        exit 0
        ;;
      *)
        echo "Unknown option: $1" >&2
        usage
        exit 1
        ;;
    esac
  done
}

ensure_tools() {
  if ! command -v tmux >/dev/null 2>&1; then
    echo "tmux is required." >&2
    exit 1
  fi
  if ! command -v ansitoimg >/dev/null 2>&1; then
    echo "ansitoimg is required." >&2
    exit 1
  fi
  if ! command -v wkhtmltoimage >/dev/null 2>&1; then
    echo "wkhtmltoimage is required." >&2
    exit 1
  fi
}

ensure_dirs() {
  mkdir -p "$(dirname "$OUT_PNG")"
  mkdir -p "$TMUX_TMPDIR"
  mkdir -p "$SANDBOX_HOME"
}

start_session() {
  if tmux -L "$TMUX_SOCKET" has-session -t "$SESSION_NAME" 2>/dev/null; then
    tmux -L "$TMUX_SOCKET" kill-session -t "$SESSION_NAME"
  fi

  tmux -L "$TMUX_SOCKET" new-session -d -s "$SESSION_NAME" -x "$TMUX_COLUMNS" -y "$TMUX_ROWS" \
    "cd \"$(pwd)\" && HOME=\"$SANDBOX_HOME\" bun src/index.tsx"
}

capture() {
  local out_ansi out_html
  out_ansi="${OUT_PNG%.png}.ansi"
  out_html="${OUT_PNG%.png}.html"

  if [[ -z "$PNG_WIDTH" ]]; then
    PNG_WIDTH="$((TMUX_COLUMNS * CHAR_PX + 64))"
  fi

  tmux -L "$TMUX_SOCKET" capture-pane -e -p -t "$SESSION_NAME" > "$out_ansi"
  ansitoimg --plugin html --width "$TMUX_COLUMNS" "$out_ansi" "$out_html"
  wkhtmltoimage --width "$PNG_WIDTH" --disable-smart-width "$out_html" "$OUT_PNG" >/dev/null 2>&1
  echo "PNG: $OUT_PNG"
}

cleanup() {
  if tmux -L "$TMUX_SOCKET" has-session -t "$SESSION_NAME" 2>/dev/null; then
    tmux -L "$TMUX_SOCKET" kill-session -t "$SESSION_NAME"
  fi
}

parse_options "$@"
ensure_tools
ensure_dirs
start_session
sleep "$CAPTURE_DELAY_SECONDS"
capture
cleanup
