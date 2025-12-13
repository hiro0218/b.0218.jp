'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type PostWidgetManagerProps = {
  children: ReactNode;
  contentRef: React.RefObject<HTMLDivElement>;
};

/**
 * Twitterなどのウィジェット読み込みを管理
 */
export function PostWidgetManager({ children, contentRef }: PostWidgetManagerProps) {
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

  return <section ref={contentRef}>{children}</section>;
}
