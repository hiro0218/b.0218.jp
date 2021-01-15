// @ts-ignore
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
export const mokuji = (content: HTMLElement): void => {
  const details = content.querySelector('.js-mokuji details');

  if (details) {
    // 目次一覧を作成
    const mokujiList = getMokujiList(content);

    window.requestAnimationFrame(() => {
      details.appendChild(mokujiList);
    });
  }
};

const getMokujiList = (content: HTMLElement): HTMLOListElement => {
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
