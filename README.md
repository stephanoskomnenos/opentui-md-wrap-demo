# OpenTUI Markdown Wrap Demo

Minimal reproduction for a CJK wrap duplication issue in the OpenTUI markdown component.

## Run

```bash
bun src/index.tsx
```

## Capture Screenshot

```bash
scripts/capture.sh --tmux-columns 38 --out-png ./tmp/demo-38.png
scripts/capture.sh --tmux-columns 39 --out-png ./tmp/demo-39.png
scripts/capture.sh --tmux-columns 40 --out-png ./tmp/demo-40.png
```

## Devcontainer

This repo includes a devcontainer config (`.devcontainer/devcontainer.json`) and Dockerfile per GitHub/Codespaces guidance.
It installs:
- tmux
- wkhtmltopdf (wkhtmltoimage)
- python3 + pipx (ansitoimg)
- bun
- CJK fonts

Steps:
1. Open in a devcontainer or Codespaces.
1. The `postCreateCommand` runs `pipx install ansitoimg` when the container is created.
1. `PATH` includes `/root/.local/bin` so the `ansitoimg` CLI is available.
1. Run the capture commands above.

## Files Produced

Each capture generates:
- `tmp/demo-XX.ansi`
- `tmp/demo-XX.html`
- `tmp/demo-XX.png`

## Expected / Observed

- Width 39 reproduces the duplicated CJK glyph at the wrap boundary.
- Widths 38 and 40 serve as nearby controls.
- Width 45 should render normally.
