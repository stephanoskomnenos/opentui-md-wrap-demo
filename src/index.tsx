#!/usr/bin/env bun
import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import type React from 'react';

/**
 * Builds the markdown content used to reproduce the CJK wrap duplication.
 */
function buildMarkdownContent(): string {
  return [
    '### 🔎 zwar',
    '',
    '**中文**',
    '- 这是用于复现的中文行：在aber (“但”)引入的转折从句前表示让步：虽然，的确',
    '- 这是用于复现的中文行：当全角字符刚好在边界处断行时可能出现重复。',
    '- Franz Kafka, Amerika:',
    '',
    '**英文**',
    '- Signals a following contrary clause, which is usually introduced with aber (“but”),',
    '  stressing that the speaker is aware of the contradiction.',
  ].join('\n');
}

/**
 * Renders the demo UI using a layout similar to the main app:
 * minimal single markdown block.
 */
function App(): React.ReactNode {
  return (
    <box flexDirection="column" width="100%" height="100%">
      <markdown content={buildMarkdownContent()} conceal />
    </box>
  );
}

/**
 * Boots a minimal OpenTUI app for markdown rendering.
 */
async function main(): Promise<void> {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    useAlternateScreen: true,
  });
  const root = createRoot(renderer);
  root.render(<App />);
}

void main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
