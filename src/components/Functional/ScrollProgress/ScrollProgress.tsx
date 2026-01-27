'use client';

import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';
import { useScrollProgress } from './useScrollProgress';

/**
 * 記事の読み進め状況を示すスクロール進捗インジケーター
 * ページ上部に固定表示される
 */
export function ScrollProgress(): ReactNode {
  const progress = useScrollProgress();

  return <ProgressBar aria-hidden="true" style={{ width: `${progress}%` }} />;
}

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-index-base);
  height: 4px;
  pointer-events: none;
  background: var(--colors-accent-800);
  transition: width 0.1s linear;
`;
