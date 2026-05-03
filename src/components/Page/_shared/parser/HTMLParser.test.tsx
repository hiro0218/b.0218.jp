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

vi.mock('@/components/UI/LinkPreview', () => ({
  // biome-ignore lint/style/useNamingConvention: React components must be PascalCase
  LinkPreview: (props: { link: string; title: string; domain: string }) => (
    <div data-link={props.link} data-testid="link-preview">
      {props.title}
    </div>
  ),
}));

import { parser } from './HTMLParser';

const renderParser = (html: string) => render(<div>{parser(html)}</div>);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('parser', () => {
  it('プレーン HTML をそのまま描画する', () => {
    const { container } = renderParser('<p>hello</p>');
    expect(container.querySelector('p')?.textContent).toBe('hello');
  });

  it('table を div.c-table-scrollable で包む', () => {
    const { container } = renderParser('<table><tbody><tr><td>cell</td></tr></tbody></table>');
    expect(container.querySelector('.c-table-scrollable table')).not.toBeNull();
  });

  it('handleAnchor が undefined を返した外部リンクは href とテキストが保持される', () => {
    const { container } = renderParser('<a href="https://example.com">外部リンク</a>');
    const anchor = container.querySelector('a[href="https://example.com"]');
    expect(anchor).not.toBeNull();
    expect(anchor?.textContent).toBe('外部リンク');
  });

  it('handleAnchor が undefined を返した外部リンクのネストした要素も保持される', () => {
    const { container } = renderParser('<a href="https://example.com"><strong>強調</strong>後</a>');
    const anchor = container.querySelector('a[href="https://example.com"]');
    expect(anchor?.querySelector('strong')?.textContent).toBe('強調');
    expect(anchor?.textContent).toBe('強調後');
  });

  it('どの replacer もマッチしない要素は元の name と属性のまま描画される', () => {
    const { container } = renderParser('<section data-foo="bar"><span>x</span></section>');
    const section = container.querySelector('section[data-foo="bar"]');
    expect(section?.querySelector('span')?.textContent).toBe('x');
  });

  it('CodePen iframe の firstChild テキストを CodePen に書き換える', () => {
    const html =
      '<iframe src="https://codepen.io/foo/embed/x" title="t">See the Pen &#x3C;a href="https://codepen.io/foo/pen/x">title&#x3C;/a></iframe>';
    const result = parser(html);
    expect(JSON.stringify(result)).toContain('"children":"CodePen"');
  });
});

describe('Alert ハンドラ', () => {
  it('rehypeGfmAlert が出力する <script class="gfm-alert"> から Alert を描画する', () => {
    const json = JSON.stringify({ type: 'alert', data: { type: 'note', text: 'note body' } });
    const { container, queryByTestId } = renderParser(
      `<script class="gfm-alert" type="application/json">${json}</script>`,
    );

    const alert = queryByTestId('alert');
    expect(alert).not.toBeNull();
    expect(alert?.dataset.alertType).toBe('note');
    expect(alert?.textContent).toBe('note body');
    expect(container.querySelector('script.gfm-alert')).toBeNull();
  });

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
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container, queryByTestId } = renderParser('<div class="gfm-alert">not-json</div>');
    expect(queryByTestId('alert')).toBeNull();
    expect(container.querySelector('.gfm-alert')).not.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));
  });
});

describe('LinkPreview ハンドラ', () => {
  it('rehype0218 が出力する <script class="link-preview"> から LinkPreview を描画する', () => {
    const json = JSON.stringify({
      type: 'link-preview',
      data: {
        link: 'https://example.com',
        card: 'summary',
        thumbnail: 'thumb.png',
        title: 'Script-form Example',
        description: 'desc',
        domain: 'example.com',
      },
    });
    const { container, queryByTestId } = renderParser(
      `<script class="link-preview" type="application/json">${json}</script>`,
    );

    const preview = queryByTestId('link-preview');
    expect(preview).not.toBeNull();
    expect(preview?.dataset.link).toBe('https://example.com');
    expect(preview?.textContent).toBe('Script-form Example');
    expect(container.querySelector('script.link-preview')).toBeNull();
  });

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
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container, queryByTestId } = renderParser('<div class="link-preview">not-json</div>');
    expect(queryByTestId('link-preview')).toBeNull();
    expect(container.querySelector('.link-preview')).not.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));
  });
});
