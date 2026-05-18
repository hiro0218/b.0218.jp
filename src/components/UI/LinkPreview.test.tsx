import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LinkPreview } from './LinkPreview';

afterEach(() => {
  cleanup();
});

describe('LinkPreview', () => {
  it('summary_large_image 用のレイアウト対象クラスを描画する', () => {
    const { container } = render(
      <LinkPreview
        card="summary_large_image"
        description="description"
        domain="example.com"
        link="https://example.com"
        thumbnail="https://example.com/thumbnail.png"
        title="Example"
      />,
    );

    const anchor = container.querySelector('a[data-card="summary_large_image"]');
    expect(anchor).not.toBeNull();
    expect(anchor?.querySelector('.p-link-preview-body')).not.toBeNull();
    expect(anchor?.querySelector('.p-link-preview-thumbnail')).not.toBeNull();
  });
});
