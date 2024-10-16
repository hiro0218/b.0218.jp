import { Mokuji as MokujiJs, Destroy as MokujiJsDestroy, type MokujiOption } from 'mokuji.js';
import { usePathname } from 'next/navigation';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import type { MokujiProps } from './type';

const MOKUJI_OPTION: MokujiOption = {
  anchorType: false,
  anchorLink: true,
  anchorLinkSymbol: '#',
  anchorContainerTagName: 'ol',
} as const;

type ReturnProps = {
  refMokuji: RefObject<HTMLDivElement | null>;
  refDetailContent: RefObject<HTMLDivElement | null>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const pathname = usePathname();
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

    return () => {
      MokujiJsDestroy();
    };
  }, [pathname, refContent]);

  return { refMokuji, refDetailContent };
};
