import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Mock dependencies                                                 */
/* ------------------------------------------------------------------ */

vi.mock('@/ui/styled', () => ({
  css: () => 'mocked-css-class',
  cx: (...args: string[]) => args.filter(Boolean).join(' '),
  styled: new Proxy(
    {},
    {
      get: (_target, tagName: string) => (_strings: TemplateStringsArray) => {
        // biome-ignore lint/suspicious/noExplicitAny: test mock requires dynamic element type
        const Element = tagName as any;
        const component = ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => (
          <Element {...props}>{children}</Element>
        );
        component.displayName = `styled.${tagName}`;
        return component;
      },
    },
  ),
}));

vi.mock('@/ui/styled/components/postTagAnchor', () => ({
  postTagAnchor: 'mocked-post-tag-anchor',
}));

vi.mock('@/ui/styled/utilities/text-ellipsis', () => ({
  textEllipsis: 'mocked-text-ellipsis',
}));

vi.mock('@/components/UI/Anchor', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  Anchor: ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => <a {...props}>{children}</a>,
}));

vi.mock('@/components/UI/Date', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  PostDate: ({ date }: { date: string }) => <time>{date}</time>,
}));

vi.mock('@/components/UI/Layout/Stack', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  Stack: ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock('@/ui/icons', () => ({
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  CodeBracketIcon: (props: Record<string, unknown>) => <svg data-testid="icon-development" {...props} />,
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  ComputerDesktopIcon: (props: Record<string, unknown>) => <svg data-testid="icon-technology" {...props} />,
  // biome-ignore lint/style/useNamingConvention: React component mock requires PascalCase
  DocumentTextIcon: (props: Record<string, unknown>) => <svg data-testid="icon-other" {...props} />,
  // biome-ignore lint/style/useNamingConvention: constant export matching source module
  ICON_SIZE_XS: 16,
}));

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                      */
/* ------------------------------------------------------------------ */

import { ArticleCard } from '@/components/UI/ArticleCard';

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('ArticleCard', () => {
  afterEach(() => {
    cleanup();
  });

  /* ================================================================ */
  /*  CategoryBadge visibility                                        */
  /* ================================================================ */
  describe('CategoryBadge の表示制御', () => {
    it('category が undefined の場合、CategoryBadge が表示されない', () => {
      render(<ArticleCard date="2024-01-01" link="/posts/test" title="テスト記事" />);

      const badge = screen.queryByLabelText('開発');
      const badgeTech = screen.queryByLabelText('テクノロジー');
      const badgeOther = screen.queryByLabelText('その他');

      expect(badge).toBeNull();
      expect(badgeTech).toBeNull();
      expect(badgeOther).toBeNull();
    });

    it('category が指定された場合、CategoryBadge が表示される', () => {
      render(<ArticleCard category="development" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      const badge = screen.getByLabelText('開発');
      expect(badge).toBeDefined();
    });
  });

  /* ================================================================ */
  /*  Accessibility                                                   */
  /* ================================================================ */
  describe('アクセシビリティ', () => {
    it('development カテゴリの場合、aria-label が「開発」に設定される', () => {
      render(<ArticleCard category="development" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      const badge = screen.getByLabelText('開発');
      expect(badge.getAttribute('aria-label')).toBe('開発');
    });

    it('technology カテゴリの場合、aria-label が「テクノロジー」に設定される', () => {
      render(<ArticleCard category="technology" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      const badge = screen.getByLabelText('テクノロジー');
      expect(badge.getAttribute('aria-label')).toBe('テクノロジー');
    });

    it('other カテゴリの場合、aria-label が「その他」に設定される', () => {
      render(<ArticleCard category="other" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      const badge = screen.getByLabelText('その他');
      expect(badge.getAttribute('aria-label')).toBe('その他');
    });
  });

  /* ================================================================ */
  /*  Category icons                                                  */
  /* ================================================================ */
  describe('カテゴリアイコン', () => {
    it('development カテゴリの場合、CodeBracketIcon が描画される', () => {
      render(<ArticleCard category="development" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      expect(screen.getByTestId('icon-development')).toBeDefined();
      expect(screen.queryByTestId('icon-technology')).toBeNull();
      expect(screen.queryByTestId('icon-other')).toBeNull();
    });

    it('technology カテゴリの場合、ComputerDesktopIcon が描画される', () => {
      render(<ArticleCard category="technology" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      expect(screen.getByTestId('icon-technology')).toBeDefined();
      expect(screen.queryByTestId('icon-development')).toBeNull();
      expect(screen.queryByTestId('icon-other')).toBeNull();
    });

    it('other カテゴリの場合、DocumentTextIcon が描画される', () => {
      render(<ArticleCard category="other" date="2024-01-01" link="/posts/test" title="テスト記事" />);

      expect(screen.getByTestId('icon-other')).toBeDefined();
      expect(screen.queryByTestId('icon-development')).toBeNull();
      expect(screen.queryByTestId('icon-technology')).toBeNull();
    });
  });
});
