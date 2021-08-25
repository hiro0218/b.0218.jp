import { Mokuji as MokujiJs } from 'mokuji.js';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useRef } from 'react';

const Mokuji = ({ refContent }: { refContent: MutableRefObject<HTMLDivElement> }) => {
  const { asPath } = useRouter();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mokujiList: HTMLOListElement = new MokujiJs(refContent.current, {
      anchorType: true,
      anchorLink: true,
      anchorLinkSymbol: '#',
      anchorLinkBefore: false,
      anchorLinkClassName: 'anchor',
    });

    if (mokujiList?.childNodes.length !== 0) {
      mokujiList.classList.add('c-mokuji__list');
      refDetail.current.appendChild(mokujiList);
    } else {
      refMokuji.current.style.display = 'none';
    }
  }, [asPath, refContent]);

  return (
    <div key={asPath} ref={refMokuji} className="c-mokuji">
      <details ref={refDetail} open>
        <summary></summary>
      </details>
    </div>
  );
};

export default Mokuji;
