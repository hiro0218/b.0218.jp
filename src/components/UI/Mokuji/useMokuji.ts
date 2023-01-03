import { Mokuji as MokujiJs } from 'mokuji.js';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useRef } from 'react';

import { MokujiProps } from './type';

type ReturnProps = {
  refMokuji: MutableRefObject<HTMLDivElement>;
  refDetail: MutableRefObject<HTMLDetailsElement>;
};

export const useMokuji = ({ refContent }: MokujiProps): ReturnProps => {
  const { asPath } = useRouter();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetail = useRef<HTMLDetailsElement>(null);
  const refFirstRender = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (refFirstRender.current) {
        refFirstRender.current = false;
        return;
      }
    }

    requestAnimationFrame(() => {
      const mokujiList = MokujiJs(refContent.current, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
        anchorContainerTagName: 'ol',
      });

      if (mokujiList.childNodes.length !== 0) {
        refDetail.current.appendChild(mokujiList);
        refMokuji.current.style.display = 'block';
      } else {
        refMokuji.current.style.display = 'none';
      }
    });
  }, [asPath, refContent]);

  return { refMokuji, refDetail };
};
