import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';

const { getPagesJson } = vi.hoisted(() => ({ getPagesJson: vi.fn() }));

vi.mock('@/lib/source/page', () => ({ getPagesJson }));
vi.mock('@/lib/source/activities', () => ({ getActivitiesJson: () => ({ companies: [], works: [] }) }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

import { Template } from './Template';

const pages = [
  { slug: 'about', title: 'About', date: '2024-01-01', content: '<p>運営者の紹介</p>' },
  { slug: 'privacy', title: 'Privacy', date: '2024-01-01', content: '<p>個人情報の扱い</p>' },
];

type JsonLd = { '@type': string };

function readJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');

  return JSON.parse(script?.textContent ?? 'null') as JsonLd | JsonLd[];
}

beforeEach(() => {
  getPagesJson.mockReturnValue(pages);
});

test.each([
  ['about', 'About', 'サイトと運営者について', '運営者の紹介'],
  ['privacy', 'Privacy', 'プライバシーポリシー', '個人情報の扱い'],
] as const)('%s の場合、設定のタイトルと説明、固定ページの本文を描画する', (slug, title, description, body) => {
  render(<Template slug={slug} />);

  expect(screen.getByRole('heading', { level: 1, name: title })).toBeDefined();
  expect(screen.getByText(description)).toBeDefined();
  expect(screen.getByText(body)).toBeDefined();
});

test('about の場合、設定のタイトルと説明を持つ AboutPage と、ProfilePage、活動実績の一覧を JSON-LD に出す', () => {
  const { container } = render(<Template slug="about" />);

  const jsonLd = readJsonLd(container) as JsonLd[];

  expect(jsonLd.map((item) => item['@type'])).toEqual(['AboutPage', 'ProfilePage', 'ItemList']);
  expect(jsonLd[0]).toMatchObject({ name: 'About', description: 'サイトと運営者について' });
});

test('privacy の場合、設定のタイトルと説明を持ち、運営者の組織を含む WebPage を JSON-LD に出す', () => {
  const { container } = render(<Template slug="privacy" />);

  expect(readJsonLd(container)).toMatchObject({
    '@type': 'WebPage',
    name: 'Privacy',
    description: 'プライバシーポリシー',
    about: { '@type': 'Organization' },
  });
});

test('固定ページのデータが無い場合、notFound を呼ぶ', () => {
  getPagesJson.mockReturnValue([]);

  expect(() => render(<Template slug="about" />)).toThrow('NEXT_NOT_FOUND');
});
