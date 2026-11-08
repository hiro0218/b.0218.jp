'use client';

import type { ReactNode } from 'react';

import { useHeaderVisibility } from '@/components/App/useHeaderVisibility';
import useIsMounted from '@/hooks/useIsMounted';
import { css, styled } from '@/ui/styled';

type Props = {
  children: ReactNode;
};

// 中身（ロゴ・ナビ・検索）は import せず、Header（Server Component）から children で受ける。ここは client の境界で、import すると中身まで client になるため
export function Layout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderVisibility();

  return (
    <div className={underlineStyle}>
      <Header data-is-hide={!isHeaderShown} data-is-mounted={isMounted}>
        {children}
      </Header>
    </div>
  );
}

const underlineStyle = css`
  height: var(--sizes-header);
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-header);
  height: var(--sizes-header);
  margin: 0 auto;
  pointer-events: none;
  isolation: isolate;
  transition:
    transform var(--transition-slow),
    opacity var(--transition-slow);
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.01s;
  }

  /* 帯は塗らない。塗ると、先頭では body の斜めの帯が隠れる。スクロールで戻して本文の上に重なったときは、本文が隠れる。
     空いた部分ではクリックを受けない。受けると、見えている本文を押せなくなる。
     pointer-events は子へ継承されるため、クリックを受ける要素の指定はここに集め、ロゴ・ナビ・検索には書かない */
  a,
  button,
  nav {
    pointer-events: auto;
  }

  &[data-is-mounted='true'] {
    opacity: 1;
    transform: translateY(0);

    &[data-is-hide='true'] {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
`;
