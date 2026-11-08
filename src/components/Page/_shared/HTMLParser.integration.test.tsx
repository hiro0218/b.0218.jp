// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { createMarkdownToPostHtmlString } from '~/build/article/markdownToHtmlString';
import type { LinkPreviewCache } from '~/build/article/rehype0218';
import { setCacheEntry } from '~/build/article/rehype0218/transform/linkPreview/cache';

// build 側の実変換（rehypeGfmAlert / rehype0218 の linkPreview）が生成した HTML を
// runtime 側の parser に通し、埋め込みコンテンツ契約が両端で一致していることを検証する。
// UI コンポーネント自体の見た目は他テストの対象のため、ここでは復元されたデータだけを見る。
// jsdom で動かさない。build の変換が使う Shiki の wasm は、jsdom の Blob に無い Blob.prototype.stream() を呼ぶため
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

const renderToHtml = (html: string) => renderToStaticMarkup(<div>{parser(html)}</div>);

describe('HTMLParser integration', () => {
  it('rehypeGfmAlert が実際に変換した HTML から Alert を復元する', async () => {
    const markdown = ['> [!NOTE]', '> これはラウンドトリップテスト用のノートです。'].join('\n');
    const html = await createMarkdownToPostHtmlString()(markdown);

    expect(renderToHtml(html)).toContain(
      '<div data-alert-type="note" data-testid="alert">これはラウンドトリップテスト用のノートです。</div>',
    );
  });

  it('rehype0218 の linkPreview が実際に変換した HTML から LinkPreview を復元する', async () => {
    // 実ネットワークに依存しないよう、OGP 取得結果をキャッシュへ事前投入して fetch をスキップさせる。
    const cache: LinkPreviewCache = {};
    setCacheEntry(cache, 'https://example.com', {
      title: 'Example Domain',
      description: 'ラウンドトリップテスト用の説明文です。',
      image: 'https://example.com/thumb.png',
      card: 'summary',
    });

    const markdown = '<https://example.com>';
    const html = await createMarkdownToPostHtmlString({ sharedCache: cache })(markdown);

    expect(renderToHtml(html)).toContain(
      '<div data-link="https://example.com" data-testid="link-preview">Example Domain</div>',
    );
  });
});
