import Mokuji from 'mokuji.js';

// <div class="c-mokuji">
//   <details>
//     <summary></summary>
//     <ol class="c-mokuji__list">
//       <li><a></a></li>
//       <li><a></a></li>
//     </ol>
//   </details>
// </div>
export const mokuji = (content: Element): void => {
  const mokuji: HTMLDivElement = content.querySelector('.js-mokuji');
  const details = mokuji.querySelector('details');

  if (details) {
    // 目次一覧を作成
    const mokujiList = getMokujiList(content);

    if (mokujiList.childNodes.length !== 0) {
      window.requestAnimationFrame(() => {
        details.appendChild(mokujiList);
      });
    } else {
      mokuji.style.display = 'none';
    }
  }
};

const getMokujiList = (content: Element): HTMLOListElement => {
  const mokujiList: HTMLOListElement = new Mokuji(content, {
    anchorType: true,
    anchorLink: true,
    anchorLinkSymbol: '#',
    anchorLinkBefore: false,
    anchorLinkClassName: 'anchor',
  });

  mokujiList.classList.add('c-mokuji__list');

  return mokujiList;
};
