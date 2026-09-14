'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type WidgetManagerProps = {
  children: ReactNode;
  contentRef: React.RefObject<HTMLDivElement>;
};

/**
 * Twitterなどのウィジェット読み込みを管理
 */
export function WidgetManager({ children, contentRef }: WidgetManagerProps) {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should re-run when the pathname changes to load Twitter widgets for the new page.
  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    if ('twttr' in window) {
      window.twttr?.widgets.load(contentRef.current);
    }
  }, [pathname, contentRef]);

  // e-content は Bridgy Fed 等の microformats2 パーサー向け
  // 広告分割で本文が複数の .post-content に分かれるため、全体を包むこの要素だけに付ける（workaround）
  return (
    <section className="e-content" ref={contentRef}>
      {children}
    </section>
  );
}
