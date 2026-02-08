'use client';

import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';
import { useScrollProgress } from './useScrollProgress';

/**
 * 記事の読み進め状況を示すスクロール進捗インジケーター
 * ページ上部に固定表示される
 */
export function ScrollProgress(): ReactNode {
  const ref = useScrollProgress();

  return <ProgressBar aria-hidden="true" ref={ref} />;
}

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: calc(var(--z-index-header) + 1);
  width: 100%;
  height: var(--spacing-½);
  pointer-events: none;
  background: var(--colors-accent-800);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;
`;
