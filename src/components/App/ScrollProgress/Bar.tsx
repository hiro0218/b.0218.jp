'use client';

import { useRef } from 'react';
import { styled } from '@/ui/styled';
import { useScrollProgressFallback } from './useScrollProgressFallback';

type Props = {
  /** 対象要素に付与されている data 属性名（`data-` を含む属性名そのもの） */
  targetAttr: string;
};

export function ScrollProgressBar({ targetAttr }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  useScrollProgressFallback(barRef, targetAttr);

  return <ProgressBar aria-hidden="true" ref={barRef} />;
}

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: calc(var(--z-index-header) + 1);
  width: 100%;
  height: var(--spacing-75);
  pointer-events: none;
  background-color: var(--colors-accent-800);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;

  /* 判定条件は useScrollProgressFallback.ts の CSS.supports 呼び出しと文字列を一致させること */
  @supports (view-timeline-name: --scroll-progress) and (animation-range: contain) {
    animation: scrollProgress 1ms linear both;
    animation-timeline: --scroll-progress;
    animation-range: contain;
  }
`;
