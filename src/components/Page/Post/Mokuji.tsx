'use client';

import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react/ssr';

import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

import { useMokuji } from './Mokuji/useMokuji';

type Props = {
  refContent: RefObject<HTMLDivElement>;
  className?: string;
};

export function Mokuji({ refContent, className }: Props) {
  const pathname = usePathname();
  const { mokujiContainerRef, mokujiDetailsRef, mokujiListContainerRef } = useMokuji({ refContent, pathname });

  return (
    <Root aria-label="目次" className={className} key={pathname} ref={mokujiContainerRef}>
      <Details ref={mokujiDetailsRef}>
        <Summary>
          目次
          <IconContainer>
            <CaretDownIcon data-disclosure="closed" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
            <CaretUpIcon data-disclosure="open" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </IconContainer>
        </Summary>
        <DetailsContent ref={mokujiListContainerRef} />
      </Details>
    </Root>
  );
}

const Root = styled.nav`
  /* 項目の大きさは、列の幅で変えない。16rem 以上の列だけ 16px にすると、項目の間隔が 32 から 36 に変わり、ナビ・タグ・日付（14px）より目次だけが大きく見える */
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-sm);
  background-color: var(--colors-white);

  &[data-visible='false'] {
    display: none;
  }

  a {
    display: flex;
    align-items: center;
    min-height: var(--tap-target);
    padding: var(--spacing-75) var(--spacing-100);
    /* 現在の項目を除き、文字色を主（gray-900）にしない。隣の本文（副）より目次だけが濃く見えるため */
    color: var(--colors-gray-700);
    /* 列を広げない。列の幅は、記事の幅を削らずに余った分で決まるため */
    word-break: auto-phrase;
    border-radius: var(--radii-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      transform var(--transition-fast);

    &:hover {
      background-color: var(--colors-gray-a-75);
    }

    &:active {
      transform: scale(0.98);
    }

    &[aria-current='true'] {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-a-100);

      &:hover {
        background-color: var(--colors-gray-a-100);
      }
    }
  }

  /* position: fixed を使わない。使うと、列の位置を画面の中央から計算し直すことになり、記事の終わりを過ぎてもフッターの上に残るため */
  @media (--isPostTwoColumn) {
    --mokuji-block-offset: calc(var(--sizes-header) + var(--spacing-400));
    --mokuji-summary-block-size: var(--spacing-600);

    /* 目次と PostContainer の間に、位置指定の要素を挟まない。inset: 0 と grid-column の基準は、最も近い位置指定の祖先である PostContainer（position: relative の格子）のため。
       position: absolute も外さない。useMokuji.ts が、この値で 2 列目に置く配置かを判定し、開いた状態にして追従スクロールもするため */
    position: absolute;
    inset: 0;
    z-index: var(--z-index-base);
    grid-column: 2 / 3;
    background-color: transparent;
    isolation: isolate;
  }
`;

const Details = styled.details`
  border: 1px solid var(--colors-gray-a-100);
  border-radius: var(--radii-md);
  transition: background-color var(--transition-slow);

  &:not([open]) {
    &:hover {
      background-color: var(--colors-gray-a-50);
    }
    &:active {
      background-color: var(--colors-gray-a-100);
    }
  }

  &:not([open]) [data-disclosure='closed'],
  &[open] [data-disclosure='open'] {
    opacity: 1;
    transform: scale(1);
  }

  @media (--isPostTwoColumn) {
    position: sticky;
    inset-block-start: var(--mokuji-block-offset);
    border: none;
    border-radius: 0;

    &:not([open]) {
      &:hover,
      &:active {
        background-color: transparent;
      }
    }
  }
`;

const IconContainer = styled.div`
  display: grid;
  place-items: center;
  width: var(--sizes-icon-sm);
  height: var(--sizes-icon-sm);

  [data-disclosure] {
    grid-area: 1 / 1;
    opacity: 0;
    transform: scale(0.25);
    transition:
      opacity var(--transition-slow),
      transform var(--transition-slow);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
      transition: opacity var(--transition-slow);
    }
  }
`;

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-block-size: var(--spacing-700);
  padding: 0 var(--spacing-300);
  /* font-weight を 900 にしない。900 はページ見出しだけに使うため */
  font-weight: var(--font-weights-bold);
  cursor: pointer;
  user-select: none;

  /* for Safari */
  &::-webkit-details-marker {
    display: none;
  }

  @media (--isPostTwoColumn) {
    gap: var(--spacing-75);
    justify-content: flex-start;
    min-block-size: var(--mokuji-summary-block-size);
    padding: var(--spacing-75) var(--spacing-100);
    /* 12px・900 にしない。項目（14px）より小さいのに太さだけが強く、目次全体が小さく見えるため */
    font-weight: var(--font-weights-normal);
    color: var(--colors-gray-900);
    letter-spacing: var(--letter-spacings-md);
    transition:
      color var(--transition-fast),
      transform var(--transition-fast);

    &:hover {
      color: var(--colors-accent-1100);
    }
  }
`;

const DetailsContent = styled.div`
  & > ol {
    /* リンク自体の inline padding と合わせて Summary のテキスト位置に揃える */
    padding: 0 var(--spacing-300) var(--spacing-300);
    margin: 0;
  }

  ol {
    list-style: none;

    li {
      list-style: none;
    }

    ol {
      padding-left: var(--spacing-300);
      margin: 0;
    }
  }

  @media (--isPostTwoColumn) {
    /* 箱の内側の余白を省かない。焦点の枠は項目の外に出るので、省くと overflow の箱の縁で切れる。
       項目の padding を減らして左に寄せない。ホバーの面が、枠の分だけ左に狭くなるため */
    --mokuji-focus-ring-room: var(--focus-ring-width);

    max-block-size: calc(100dvh - var(--mokuji-block-offset) - var(--mokuji-summary-block-size) - var(--spacing-400));
    padding-inline-start: var(--mokuji-focus-ring-room);
    padding-top: var(--spacing-75);
    margin-inline-start: calc(var(--mokuji-focus-ring-room) * -1);
    overflow-y: auto;
    overscroll-behavior: contain;

    & > ol {
      /* overflow-y: auto のスクロールバーとリンクの間に余白を確保する */
      padding: 0 var(--spacing-100) var(--spacing-300) 0;
    }

    a {
      scroll-margin-block: var(--mokuji-focus-ring-room);
    }
  }
`;
