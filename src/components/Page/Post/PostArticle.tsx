'use client';

import { type ReactNode, type RefObject, useEffect, useRef } from 'react';
import throttle from '@/lib/utils/throttle';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  className?: string;
  children: ReactNode;
};

const articleStyle = css`
  view-timeline-name: --scroll-progress;
`;

/**
 * @summary 記事の枠（article）。中身をどこまで読み進めたかを、画面上部の細いバーで示す。
 */
export function PostArticle({ className, children }: Props) {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <article className={cx(articleStyle, className)} ref={articleRef}>
      <ScrollProgressBar articleRef={articleRef} />
      {children}
    </article>
  );
}

// CSS の animation-range: contain と別の区間にしない。対応するブラウザと非対応のブラウザで、バーの進み方がそろわなくなるため
function calculateScrollProgress(target: HTMLElement): number {
  const rect = target.getBoundingClientRect();
  const scrollableHeight = rect.height - window.innerHeight;

  // viewport に収まる短い要素は割らない。scrollableHeight が負なので、割ると符号は反転し、上端が画面の中にあっても進捗を進めてしまうため
  if (scrollableHeight <= 0) return 0;

  const ratio = -rect.top / scrollableHeight;

  return Math.max(0, Math.min(1, ratio));
}

// effect の CSS.supports の文字列を、ProgressBar の @supports と別にしない。CSS と effect の片方だけが、バーを進めるようにするため
function ScrollProgressBar({ articleRef }: { articleRef: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (CSS.supports('(view-timeline-name: --scroll-progress) and (animation-range: contain)')) return;

    const article = articleRef.current;
    const bar = barRef.current;

    if (!article || !bar) return;

    const updateProgress = () => {
      bar.style.transform = `scaleX(${calculateScrollProgress(article)})`;
    };

    updateProgress();

    const throttledUpdate = throttle(updateProgress);

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [articleRef]);

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

  @supports (view-timeline-name: --scroll-progress) and (animation-range: contain) {
    animation: scrollProgress 1ms linear both;
    animation-timeline: --scroll-progress;
    animation-range: contain;
  }
`;
