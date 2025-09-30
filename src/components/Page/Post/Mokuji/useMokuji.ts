import { Mokuji as MokujiJs, type MokujiOption, type MokujiResult } from 'mokuji.js';
import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { MokujiProps } from './type';

const MOKUJI_OPTIONS: MokujiOption = {
  anchorType: false,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorLinkPosition: 'after',
} as const;

type ReturnProps = {
  mokujiContainerRef: RefObject<HTMLDivElement>;
  mokujiListContainerRef: RefObject<HTMLDivElement>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const pathname = usePathname();
  const mokujiContainerRef = useRef<HTMLDivElement>(null);
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

    const result = MokujiJs(articleContentElement, MOKUJI_OPTIONS);
    if (result) {
      mokujiInstanceRef.current = result;
      previousContentRef.current = articleContentElement;

      const hasMokujiItems = result.list?.children.length > 0;
      if (hasMokujiItems) {
        mokujiListElement.appendChild(result.list);
        mokujiContainerElement.setAttribute('data-visible', 'true');
      } else {
        mokujiContainerElement.setAttribute('data-visible', 'false');
      }
    }

    return () => {
      if (mokujiInstanceRef.current?.destroy) {
        mokujiInstanceRef.current.destroy();
        mokujiInstanceRef.current = null;
      }
      previousContentRef.current = undefined;
    };
  }, [pathname, refContent]);

  return { mokujiContainerRef, mokujiListContainerRef };
};
