import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

let mockPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import { NavigationLink } from './NavigationLink';

function renderTagsLink(pathname: string) {
  mockPathname = pathname;
  render(<NavigationLink href="/tags">tags</NavigationLink>);

  return screen.getByRole('link', { name: 'tags' });
}

test('いまのページが項目のパスと同じ場合、aria-current="page" を付ける', () => {
  expect(renderTagsLink('/tags').getAttribute('aria-current')).toBe('page');
});

test('いまのページが項目の配下にある場合、aria-current="page" を付ける', () => {
  expect(renderTagsLink('/tags/JavaScript').getAttribute('aria-current')).toBe('page');
});

test('パスの区切りが違う別のページの場合、aria-current を付けない', () => {
  expect(renderTagsLink('/tags-old').hasAttribute('aria-current')).toBe(false);
});

test('別の項目のページの場合、aria-current を付けない', () => {
  expect(renderTagsLink('/popular').hasAttribute('aria-current')).toBe(false);
});
