// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test, vi } from 'vitest';

const convert = vi.hoisted(() => vi.fn(async (markdown: string) => `<p>${markdown}</p>`));

vi.mock('~/build/shared/logger');
vi.mock('./markdownToHtmlString', () => ({
  // 何も足さない fake にしない。実行中にリンクプレビューが増える場合にだけ、保存した版が次回の版と食い違う
  createMarkdownToPostHtmlString: (options: { sharedCache: Record<string, unknown> }) => async (markdown: string) => {
    options.sharedCache['https://example.com/'] = {
      title: 'Example',
      description: null,
      image: null,
      card: null,
      fetchedAt: Date.now(),
    };
    return convert(markdown);
  },
  createMarkdownToNoteHtmlString: () => async (markdown: string) => markdown,
}));

test('実行中にリンクプレビューが増えた場合、次の実行は全記事をキャッシュから返す', async () => {
  const root = mkdtempSync(join(tmpdir(), 'post-conversion-cache-'));
  const cwd = vi.spyOn(process, 'cwd').mockReturnValue(root);

  try {
    mkdirSync(join(root, '_article', '_posts'), { recursive: true });
    for (const slug of ['a', 'b']) {
      writeFileSync(
        join(root, '_article', '_posts', `${slug}.md`),
        `---\ntitle: ${slug}\ndate: 2020-01-01\n---\n本文 ${slug}\n`,
      );
    }
    const { buildPost } = await import('./post');

    const first = await buildPost();
    expect(convert).toHaveBeenCalledTimes(2);

    convert.mockClear();
    const second = await buildPost();

    expect(convert).not.toHaveBeenCalled();
    expect(second).toEqual(first);
  } finally {
    cwd.mockRestore();
    rmSync(root, { recursive: true, force: true });
  }
});
