#!/usr/bin/env bun
import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import type React from 'react';

/**
 * Builds the markdown content used to reproduce the CJK wrap duplication.
 */
function buildMarkdownContent(): string {
  return [
    '### 示例标题',
    '- 在aber (“但”)引入的转折从句前表示让步：虽然，的确',
    '- Second line: brief English, 中文补充更长的说明细节与背景，确保内容足够长。',
    '- Third line: short EN, 中文描述进一步扩展到更多层面与示例，用于测试换行。',
  ].join('\n');
}

/**
 * Renders the demo UI using markdown-related layout:
 * scrollbox + transcript padding. (Input bar intentionally omitted.)
 */
function App(): React.ReactNode {
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
            <box width="100%">
              <markdown content={buildMarkdownContent()} conceal />
            </box>
          </box>
        </scrollbox>
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
