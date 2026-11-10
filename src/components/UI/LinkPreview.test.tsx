import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LinkPreview } from './LinkPreview';

afterEach(() => {
  cleanup();
});

// title="&lt;..." と属性に直接書かない。JSX が属性の文字列のエンティティを先に解釈し、復号の前に記号になるため
const ENCODED_TITLE = '&lt;div&gt; &amp; more';

const props = {
  card: 'summary_large_image',
  description: 'description',
  domain: 'example.com',
  link: 'https://example.com/article',
  thumbnail: 'https://example.com/thumbnail.png',
  title: 'Example',
};

describe('LinkPreview', () => {
  it('リンク先を新しいタブで開くリンクとして、題名・説明・ドメインを描画する', () => {
    render(<LinkPreview {...props} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://example.com/article');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(screen.getByText('description')).not.toBeNull();
    expect(screen.getByText('example.com')).not.toBeNull();
  });

  it('サムネイルがある場合、その画像を描画する', () => {
    const { container } = render(<LinkPreview {...props} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://example.com/thumbnail.png');
  });

  it('サムネイルが空の場合、画像を描画しない', () => {
    const { container } = render(<LinkPreview {...props} thumbnail="" />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('題名の HTML エンティティ（&lt; &gt; &amp;）の場合、記号に戻して描画する', () => {
    render(<LinkPreview {...props} title={ENCODED_TITLE} />);

    expect(screen.getByText('<div> & more')).not.toBeNull();
  });

  it('summary_large_image 用のレイアウト対象クラスを描画する', () => {
    const { container } = render(<LinkPreview {...props} />);

    const anchor = container.querySelector('a[data-card="summary_large_image"]');
    expect(anchor).not.toBeNull();
    expect(anchor?.querySelector('.p-link-preview-body')).not.toBeNull();
    expect(anchor?.querySelector('.p-link-preview-thumbnail')).not.toBeNull();
  });
});
