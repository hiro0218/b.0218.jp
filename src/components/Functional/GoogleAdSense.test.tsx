import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { GoogleAdSense } from './GoogleAdSense';

vi.mock('next/script', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ id, src }: { id?: string; src?: string }) => createElement('script', { id, src }),
  };
});

afterEach(() => {
  cleanup();
});

it('出版者 ID を渡した場合、広告のスクリプトにはそのまま、Funding Choices には ca- を除いた形で使う', () => {
  render(<GoogleAdSense publisherId="ca-pub-1234567890" />);

  const sources = Array.from(document.querySelectorAll('script')).map((el) => el.getAttribute('src') ?? el.id);
  expect(sources).toEqual([
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890',
    'https://fundingchoicesmessages.google.com/i/pub-1234567890?ers=1',
    'googlefc-present',
  ]);
});
