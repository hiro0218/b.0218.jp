import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { ThirdPartyScripts } from './ThirdPartyScripts';

const env = vi.hoisted(() => ({ isProduction: true }));

vi.mock('@/lib/config/environment', () => ({
  get isProduction() {
    return env.isProduction;
  },
}));

vi.mock('next/script', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ id, src }: { id?: string; src?: string }) => createElement('script', { id, src }),
  };
});

vi.mock('@next/third-parties/google', async () => {
  const { createElement } = await import('react');
  return {
    // biome-ignore lint/style/useNamingConvention: camelCase に直さない。React コンポーネントのモックには PascalCase の名前が必要なため
    GoogleAnalytics: ({ gaId }: { gaId: string }) => createElement('script', { id: `ga:${gaId}` }),
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const preconnectHrefs = () =>
  Array.from(document.head.querySelectorAll('link[rel="preconnect"]')).map((link) => link.getAttribute('href'));

const scriptNames = () => Array.from(document.querySelectorAll('script')).map((el) => el.getAttribute('src') ?? el.id);

it('本番の場合、計測と広告のスクリプト、5 ホストへの preconnect、publisher.js を出す', () => {
  env.isProduction = true;
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST');

  render(<ThirdPartyScripts />);

  // preconnect の順序は検査しない。順序は接続の速さに影響しないため、集合だけを見る
  expect(new Set(preconnectHrefs())).toEqual(
    new Set([
      'https://www.googletagmanager.com',
      'https://www.google.com',
      'https://googleads.g.doubleclick.net',
      'https://pagead2.googlesyndication.com',
      'https://fundingchoicesmessages.google.com',
    ]),
  );
  // script の順序も検査しない。ここでは Script を DOM へ直接出すモックで、本物の next/script が差し込む順序とは別のため
  const scripts = scriptNames().map((name) => (name.startsWith('http') ? new URL(name).host : name));
  expect(scripts.toSorted()).toEqual(
    [
      'ga:G-TEST',
      'pagead2.googlesyndication.com',
      'fundingchoicesmessages.google.com',
      'googlefc-present',
      'news.google.com',
    ].toSorted(),
  );
});

it('本番以外の場合、publisher.js だけを出す', () => {
  env.isProduction = false;
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST');

  render(<ThirdPartyScripts />);

  expect(preconnectHrefs()).toEqual([]);
  expect(scriptNames()).toEqual(['https://news.google.com/swg/js/v1/publisher.js']);
});
