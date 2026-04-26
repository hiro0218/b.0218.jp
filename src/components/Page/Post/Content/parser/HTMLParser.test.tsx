import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/UI/Alert', () => ({
  // biome-ignore lint/style/useNamingConvention: React components must be PascalCase
  Alert: ({ html, type }: { html: string; type: string }) => (
    <div data-alert-type={type} data-testid="alert">
      {html}
    </div>
  ),
}));

vi.mock('@/components/Page/Post/LinkPreview', () => ({
  // biome-ignore lint/style/useNamingConvention: React components must be PascalCase
  LinkPreview: (props: { link: string; title: string; domain: string }) => (
    <div data-link={props.link} data-testid="link-preview">
      {props.title}
    </div>
  ),
}));

import { parser } from './HTMLParser';

const renderParser = (html: string) => render(<div>{parser(html)}</div>);

afterEach(cleanup);

describe('parser', () => {
  it('プレーン HTML をそのまま描画する', () => {
    const { container } = renderParser('<p>hello</p>');
    expect(container.querySelector('p')?.textContent).toBe('hello');
  });

  it('table を div.c-table-scrollable で包む', () => {
    const { container } = renderParser('<table><tbody><tr><td>cell</td></tr></tbody></table>');
    expect(container.querySelector('.c-table-scrollable table')).not.toBeNull();
  });
});

describe('Alert ハンドラ', () => {
  it('class="gfm-alert" と有効な JSON で Alert を描画し元の div を消す', () => {
    const json = JSON.stringify({ type: 'alert', data: { type: 'warning', text: 'warn body' } });
    const { container, queryByTestId } = renderParser(`<div class="gfm-alert">${json}</div>`);

    const alert = queryByTestId('alert');
    expect(alert).not.toBeNull();
    expect(alert?.dataset.alertType).toBe('warning');
    expect(alert?.textContent).toBe('warn body');
    expect(container.querySelector('.gfm-alert')).toBeNull();
  });

  it('JSON が壊れている場合は元の div を保持する', () => {
    const { container, queryByTestId } = renderParser('<div class="gfm-alert">not-json</div>');
    expect(queryByTestId('alert')).toBeNull();
    expect(container.querySelector('.gfm-alert')).not.toBeNull();
  });
});

describe('LinkPreview ハンドラ', () => {
  it('class="link-preview" と有効な JSON で LinkPreview を描画し元の div を消す', () => {
    const json = JSON.stringify({
      type: 'link-preview',
      data: {
        link: 'https://example.com',
        card: 'card.png',
        thumbnail: 'thumb.png',
        title: 'Example',
        description: 'desc',
        domain: 'example.com',
      },
    });
    const { container, queryByTestId } = renderParser(`<div class="link-preview">${json}</div>`);

    const preview = queryByTestId('link-preview');
    expect(preview).not.toBeNull();
    expect(preview?.dataset.link).toBe('https://example.com');
    expect(preview?.textContent).toBe('Example');
    expect(container.querySelector('.link-preview')).toBeNull();
  });

  it('JSON が壊れている場合は元の div を保持する', () => {
    const { container, queryByTestId } = renderParser('<div class="link-preview">not-json</div>');
    expect(queryByTestId('link-preview')).toBeNull();
    expect(container.querySelector('.link-preview')).not.toBeNull();
  });
});
