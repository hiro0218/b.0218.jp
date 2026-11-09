import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { ArticleCard } from '@/components/Page/_shared/ArticleCard';

afterEach(() => {
  cleanup();
});

it('category を渡さない場合、カテゴリのバッジを出さない', () => {
  render(<ArticleCard date="2024-01-01" link="/posts/test" title="テスト記事" />);

  expect(screen.queryByRole('img')).toBeNull();
});

it.each([
  ['development', '開発'],
  ['technology', 'テクノロジー'],
  ['other', 'その他'],
] as const)('category が %s の場合、「%s」の名前を持つバッジを出す', (category, label) => {
  render(<ArticleCard category={category} date="2024-01-01" link="/posts/test" title="テスト記事" />);

  expect(screen.getByRole('img', { name: label })).toBeDefined();
});
