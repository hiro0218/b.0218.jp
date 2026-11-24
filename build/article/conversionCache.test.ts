// @vitest-environment node
// jsdom で動かさない。esbuild が import 時に `new TextEncoder().encode("") instanceof Uint8Array` を確かめ、jsdom では偽になって落ちるため。
import { expect, test } from 'vitest';
import { listPipelineSources } from './conversionCache';

test('変換が import するファイルの場合、build と src のソースと package-lock.json を返す', async () => {
  const sources = await listPipelineSources();

  expect(sources).toContain('build/article/convert.ts');
  expect(sources).toContain('build/article/markdownToHtmlString/rehype0218.ts');
  expect(sources).toContain('src/lib/domain/embeddedContent.ts');
  expect(sources).toContain('package-lock.json');
});

test('変換が import しないファイルの場合、node_modules と page.ts を返さない', async () => {
  const sources = await listPipelineSources();

  expect(sources.filter((file) => file.includes('node_modules'))).toEqual([]);
  expect(sources).not.toContain('build/article/page.ts');
});
