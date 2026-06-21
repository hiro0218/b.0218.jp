import { Mokuji as MokujiJs, type MokujiOption, type MokujiResult } from 'mokuji.js';
import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { MokujiProps } from './type';

// Match the fixed header height + buffer
const SCROLL_SPY_OFFSET_PX = 100;

const MOKUJI_OPTIONS: MokujiOption = {
  anchorType: false,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorLinkPosition: 'after',
  scrollSpy: true,
  scrollSpyOffset: SCROLL_SPY_OFFSET_PX,
} as const;

type ReturnProps = {
  mokujiContainerRef: RefObject<HTMLDivElement>;
  mokujiDetailsRef: RefObject<HTMLDetailsElement>;
  mokujiListContainerRef: RefObject<HTMLDivElement>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const pathname = usePathname();
  const mokujiContainerRef = useRef<HTMLDivElement>(null);
  const mokujiDetailsRef = useRef<HTMLDetailsElement>(null);
  const mokujiListContainerRef = useRef<HTMLDivElement>(null);
  const mokujiInstanceRef = useRef<MokujiResult | null>(null);
  const previousContentRef = useRef<HTMLElement | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathnameはルーティング毎に目次を再生成するために必要
  useEffect(() => {
    if (!mokujiListContainerRef.current || !mokujiContainerRef.current || !refContent.current) {
      return;
    }

    // Compare by reference: content element changes on navigation
    const isContentUnchanged = previousContentRef.current === refContent.current;
    if (isContentUnchanged && mokujiInstanceRef.current) {
      return;
    }

    if (mokujiInstanceRef.current?.destroy) {
      mokujiInstanceRef.current.destroy();
      mokujiInstanceRef.current = null;
    }

    if (mokujiListContainerRef.current.firstChild) {
      mokujiListContainerRef.current.replaceChildren();
    }

    const mokujiListElement = mokujiListContainerRef.current;
    const mokujiContainerElement = mokujiContainerRef.current;
    const articleContentElement = refContent.current;

    // Guard against operations on detached DOM after unmount
    if (!document.contains(mokujiListElement)) {
      return;
    }

    // Mokuji.js adds this attribute; prevent duplicate initialization
    if (mokujiListElement.querySelector('[data-mokuji-list]')) {
      return;
    }

    // 固定配置かどうかは Mokuji.tsx のメディアクエリの適用結果 (position: fixed) から読み、breakpoint の二重管理を避ける
    const isFixedLayout = () => getComputedStyle(mokujiContainerElement).position === 'fixed';
    let scrollFollowObserver: MutationObserver | null = null;

    const result = MokujiJs(articleContentElement, MOKUJI_OPTIONS);
    if (result) {
      mokujiInstanceRef.current = result;
      previousContentRef.current = articleContentElement;

      const hasMokujiItems = result.list?.children.length > 0;
      if (hasMokujiItems) {
        mokujiListElement.appendChild(result.list);
        mokujiContainerElement.setAttribute('data-visible', 'true');

        // 固定配置時は常時表示のサイドバーとして振る舞うため、開いた状態を初期値にする
        if (mokujiDetailsRef.current && isFixedLayout()) {
          mokujiDetailsRef.current.open = true;
        }

        // 固定配置ではリストが overflow するため、scroll spy の現在地が隠れたら追従スクロールする。
        // インライン配置で scrollIntoView を呼ぶとページ全体がスクロールしてしまうため固定配置に限定する
        scrollFollowObserver = new MutationObserver(() => {
          if (!isFixedLayout()) return;
          const activeAnchor = mokujiListElement.querySelector("a[aria-current='true']");
          activeAnchor?.scrollIntoView({ block: 'nearest' });
        });
        scrollFollowObserver.observe(mokujiListElement, {
          attributes: true,
          attributeFilter: ['aria-current'],
          subtree: true,
        });
      } else {
        mokujiContainerElement.setAttribute('data-visible', 'false');
      }
    }

    return () => {
      scrollFollowObserver?.disconnect();
      if (mokujiInstanceRef.current?.destroy) {
        mokujiInstanceRef.current.destroy();
        mokujiInstanceRef.current = null;
      }
      previousContentRef.current = undefined;
    };
  }, [pathname, refContent]);

  return { mokujiContainerRef, mokujiDetailsRef, mokujiListContainerRef };
};
