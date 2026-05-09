import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';
import { ScrollProgressFallback } from './ScrollProgress/Fallback';

const SCROLL_PROGRESS_ID = 'scroll-progress';

/**
 * 記事の読み進め状況を示すスクロール進捗インジケーターである。
 * ページ上部に固定表示する。
 */
export function ScrollProgress(): ReactNode {
  return (
    <>
      <ProgressBar aria-hidden="true" id={SCROLL_PROGRESS_ID} />
      <ScrollProgressFallback targetId={SCROLL_PROGRESS_ID} />
    </>
  );
}

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: calc(var(--z-index-header) + 1);
  width: 100%;
  height: var(--spacing-½);
  pointer-events: none;
  background-color: var(--colors-accent-800);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;

  @supports (animation-timeline: scroll(root block)) {
    animation: scrollProgress 1ms linear both;
    animation-timeline: scroll(root block);
  }
`;
