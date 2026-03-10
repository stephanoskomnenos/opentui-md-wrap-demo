# OpenTUI Markdown Wrap Demo

Minimal reproduction for a CJK wrap duplication issue in the OpenTUI markdown component.

## Run

```bash
bun src/index.tsx
```

## Capture Screenshot

```bash
scripts/capture.sh --tmux-columns 41 --out-png ./tmp/demo-41.png
scripts/capture.sh --tmux-columns 45 --out-png ./tmp/demo-45.png
```

### Sweep Widths

```bash
scripts/sweep.sh 36 50
```

## Expected

- Some narrow widths (around 36-50 columns) may duplicate a fullwidth CJK glyph at the wrap boundary.
- Width 45 should render normally.
