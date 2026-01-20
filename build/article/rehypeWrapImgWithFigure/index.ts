import type { Element, Root } from 'hast';
import { SKIP, visit } from 'unist-util-visit';

const WHITESPACE_ONLY_REGEX = /^\s*$/;

/**
 * rehype プラグイン: <p> 要素内の <img> を <figure> でラップ
 *
 * 変換条件:
 * - <p> 要素が <img> 要素のみを含む場合(テキストノードや他の要素があればスキップ)
 * - 各 <img> は個別の <figure> でラップされる
 *
 * @example
 * // 変換あり
 * <p><img src="1.jpg" /><img src="2.jpg" /></p>
 * → <figure><img src="1.jpg" /></figure><figure><img src="2.jpg" /></figure>
 *
 * @example
 * // 変換なし(テキストノード混在)
 * <p><img src="test.jpg" />text</p>
 * → <p><img src="test.jpg" />text</p>
 */
export default function rehypeWrapImgWithFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      // <p> 要素のみ処理
      if (node.tagName !== 'p') return;

      // parent と index が存在しない場合はスキップ
      if (!parent || index === undefined) return;

      // 子要素を走査し、空白テキストは無視。img 以外があればスキップ
      const imageChildren: Element[] = [];
      let hasNonImage = false;

      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'img') {
          imageChildren.push(child);
          continue;
        }

        if (child.type === 'text' && WHITESPACE_ONLY_REGEX.test(child.value ?? '')) {
          continue;
        }
        hasNonImage = true;
        break;
      }

      // img が存在しない、または img 以外が含まれる場合はスキップ
      if (hasNonImage || imageChildren.length === 0) return;

      // 各 img を個別の figure でラップ
      const figures: Element[] = imageChildren.map((img) => ({
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [img],
      }));

      // <p> を複数の <figure> に置き換え
      parent.children.splice(index, 1, ...figures);

      // 置き換えた要素を再訪問しないようスキップ
      return [SKIP, index + figures.length];
    });
  };
}
