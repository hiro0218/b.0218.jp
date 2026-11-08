import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { GOOGLE_ADSENSE } from '@/constants';
import { ArticleAd } from './ArticleAd';

const route = vi.hoisted(() => ({ pathname: '/a.html' }));

vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));

beforeEach(() => {
  route.pathname = '/a.html';
  window.adsbygoogle = [];
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, 'adsbygoogle');
});

it('広告の枠にスポンサーリンクという名前を付け、AdSense の ins を置く', () => {
  const { container } = render(<ArticleAd />);

  const aside = screen.getByRole('complementary', { name: 'スポンサーリンク' });
  const ins = aside.querySelector('ins.adsbygoogle');
  expect(ins?.getAttribute('data-ad-client')).toBe(GOOGLE_ADSENSE.CLIENT);
  expect(ins?.getAttribute('data-ad-slot')).toBe(GOOGLE_ADSENSE.SLOT);
  expect(container.children).toHaveLength(1);
  expect(container.firstElementChild?.children).toHaveLength(1);
  expect(container.firstElementChild?.firstElementChild).toBe(aside);
});

it('描画した場合、AdSense に広告を 1 つ要求する', () => {
  render(<ArticleAd />);

  expect(window.adsbygoogle).toHaveLength(1);
});

it('パスが変わった場合、広告の要素を作り直して、AdSense にもう一度要求する', () => {
  const { rerender } = render(<ArticleAd />);
  const first = screen.getByRole('complementary');

  route.pathname = '/b.html';
  rerender(<ArticleAd />);

  expect(screen.getByRole('complementary')).not.toBe(first);
  expect(window.adsbygoogle).toHaveLength(2);
});

it('同じパスのまま再描画した場合、広告の要素も要求も増やさない', () => {
  const { rerender } = render(<ArticleAd />);
  const first = screen.getByRole('complementary');

  rerender(<ArticleAd />);

  expect(screen.getByRole('complementary')).toBe(first);
  expect(window.adsbygoogle).toHaveLength(1);
});
