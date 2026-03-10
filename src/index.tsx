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
 * Builds transcript-style entries for the demo.
 */
function buildTranscriptEntries(): Array<{ kind: 'markdown' | 'text'; content: string }> {
  return [
    { kind: 'markdown', content: buildMarkdownContent() },
    { kind: 'text', content: '' },
    { kind: 'text', content: '> ' },
  ];
}

/**
 * Renders one transcript entry.
 */
function renderEntry(entry: { kind: 'markdown' | 'text'; content: string }): React.ReactNode {
  if (entry.kind === 'markdown') {
    return <markdown content={entry.content} conceal />;
  }

  return <text>{entry.content}</text>;
}

/**
 * Renders the demo UI using a layout similar to the main app:
 * scrollable transcript area + input bar spacer.
 */
function App(): React.ReactNode {
  const entries = buildTranscriptEntries();

  return (
    <box flexDirection="column" width="100%" height="100%">
      <box flexGrow={1} minHeight={1}>
        <scrollbox
          scrollY
          stickyScroll
          stickyStart="bottom"
          focusable={false}
          viewportCulling
          wrapperOptions={{ width: '100%', height: '100%' }}
          viewportOptions={{ width: '100%', height: '100%' }}
          contentOptions={{ width: '100%', flexDirection: 'column' }}
        >
          <box flexDirection="column" width="100%" paddingLeft={2} paddingRight={2}>
            {entries.map((entry, index) => (
              <box key={`entry-${index}`} width="100%">
                {renderEntry(entry)}
              </box>
            ))}
          </box>
        </scrollbox>
      </box>
      <box height={1} />
      <box paddingLeft={2} paddingRight={2} height={1}>
        <text>{'> '}</text>
      </box>
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
