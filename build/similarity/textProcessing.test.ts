import { expect, test } from 'vitest';
import type { Post } from '@/types/source';
import { extractTextFromPost } from './textProcessing';

function createPost(content: string): Post {
  return { title: 'タイトル', slug: 'sample', date: '2024-01-01T00:00:00.000Z', content, tags: [] };
}

test('本文に HTML タグが含まれる場合、タグと属性を除いた本文を返す', () => {
  const post = createPost('<p>本文</p><p>次</p><span style="--shiki-light:#383a42">コード</span>');

  const text = extractTextFromPost(post);

  expect(text).not.toContain('<');
  expect(text).not.toContain('shiki');
  expect(text).toContain('本文');
  expect(text).toContain('コード');
  expect(text).not.toContain('本文次');
});

test('本文が 7000 文字を超える場合、先頭 7000 文字に含まれる本文だけを返す', () => {
  const unit = '<b>x</b>';
  const post = createPost(unit.repeat(1000));

  const text = extractTextFromPost(post);

  expect(text.split('x').length - 1).toBe(Math.floor(7000 / unit.length));
});
