import { Mokuji as MokujiJs, type MokujiOption, type MokujiResult } from 'mokuji.js';
import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { MokujiProps } from './type';

const MOKUJI_OPTION: MokujiOption = {
  anchorType: false,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorLinkPosition: 'after',
} as const;

type ReturnProps = {
  refMokuji: RefObject<HTMLDivElement>;
  refDetailContent: RefObject<HTMLDivElement>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const pathname = usePathname();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetailContent = useRef<HTMLDivElement>(null);
  const mokujiResultRef = useRef<MokujiResult | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ルーティング毎に目次を生成するため
  useEffect(() => {
    if (!refDetailContent.current || !refMokuji.current) {
      return;
    }

    refDetailContent.current.replaceChildren();

    requestAnimationFrame(() => {
      // refDetailContent内にdata-mokuji-listが存在する場合は抜ける
      if (refDetailContent.current.querySelector('[data-mokuji-list]')) {
        return;
      }

      const result = MokujiJs(refContent.current, MOKUJI_OPTION);

      if (result) {
        mokujiResultRef.current = result;
        const { list } = result;

        if (list?.children.length !== 0) {
          refDetailContent.current.appendChild(list);
          refMokuji.current.style.display = 'block';
        } else {
          refMokuji.current.style.display = 'none';
        }
      }
    });

    return () => {
      if (mokujiResultRef.current?.destroy) {
        mokujiResultRef.current.destroy();
        mokujiResultRef.current = null;
      }
    };
  }, [pathname, refContent, refMokuji, refDetailContent]);

  return { refMokuji, refDetailContent };
};
