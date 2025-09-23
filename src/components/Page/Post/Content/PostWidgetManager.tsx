'use client';

import type { ReactNode } from 'react';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';

type PostWidgetManagerProps = {
  children: ReactNode;
  contentRef: React.RefObject<HTMLDivElement>;
};

/**
 * Twitterなどのウィジェット読み込みを管理
 */
export function PostWidgetManager({ children, contentRef }: PostWidgetManagerProps) {
  useTwitterWidgetsLoad({ ref: contentRef });

  return <section ref={contentRef}>{children}</section>;
}
