import { Mokuji as MokujiJs, type MokujiOption } from 'mokuji.js';
import { useRouter } from 'next/router';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { MokujiProps } from './type';

const MOKUJI_OPTION: MokujiOption = {
  anchorType: true,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorLinkBefore: false,
  anchorContainerTagName: 'ol',
} as const;

type ReturnProps = {
  refMokuji: RefObject<HTMLDivElement>;
  refDetailContent: RefObject<HTMLDivElement>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const { asPath } = useRouter();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetailContent = useRef<HTMLDivElement>(null);
  const refFirstRender = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (refFirstRender.current) {
        refFirstRender.current = false;
        return;
      }
    }

    if (!refDetailContent.current) {
      return;
    }

    refDetailContent.current.replaceChildren();

    requestAnimationFrame(() => {
      if (!refDetailContent.current || !refMokuji.current) {
        return;
      }

      const mokujiList = MokujiJs(refContent.current, MOKUJI_OPTION);

      if (mokujiList && mokujiList.childNodes.length !== 0) {
        refDetailContent.current.appendChild(mokujiList);
        refMokuji.current.style.display = 'block';
      } else {
        refMokuji.current.style.display = 'none';
      }
    });
  }, [asPath, refContent]);

  return { refMokuji, refDetailContent };
};
