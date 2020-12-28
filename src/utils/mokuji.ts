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
  // js-separateを取得できない場合はコンテンツを挿入先とする
  const insertTarget = document.querySelector('.js-separate') || content;

  // 目次一覧を作成
  const mokujiList: HTMLOListElement = new Mokuji(content, {
    anchorType: true,
    anchorLink: true,
    anchorLinkSymbol: '#',
    anchorLinkBefore: false,
    anchorLinkClassName: 'anchor',
  });

  // 目次要素が存在しない場合
  if (mokujiList.childNodes.length === 0) return;
  mokujiList.classList.add('c-mokuji__list');

  const container = document.createElement('div');
  container.classList.add('c-mokuji');

  // details/summary要素を作成
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  details.appendChild(summary);

  window.requestAnimationFrame(() => {
    // 要素を追加
    details.appendChild(mokujiList);
    container.appendChild(details);
    insertTarget.insertBefore(container, insertTarget.firstChild);
  });
};
