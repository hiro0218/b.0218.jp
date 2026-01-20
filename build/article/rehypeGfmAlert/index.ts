import type { ElementContent } from 'hast';
import { isElement } from 'hast-util-is-element';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const PREFIX_REGEX = /\[!(?<kind>[\w]+)\]\s*(?<title>.*)/g;
const PREFIX = ['[!NOTE]', '[!IMPORTANT]', '[!WARNING]', '[!TIP]', '[!CAUTION]'];

/**
 *
 * @example
 * ```html
 * <script type="application/json">
 * {
 *   "type": "alert",
 *   "data": {
 *     "type": "note",
 *     "text": "This is a note."
 *   }
 * }
 * </script>
 * ```
 */
const rehypeGfmAlert: Plugin = () => {
  return (tree) => {
    visit(tree, (node) => {
      // blockquoteだけをパースする
      if (!isElement(node, 'blockquote')) return;

      // 不要なノードを削除する
      node.children = node.children.filter((child) => !(child.type === 'text' && child.value === '\n'));

      // 空のブロッククオートは対象外
      if (node.children.length === 0) return;

      // 最初の要素は必ずparagraphである必要がある
      if (!isElement(node.children[0], 'p')) return;

      // 空のparagraphは対象外
      if (node.children[0].children.length === 0) return;

      // プレーンテキストで始まらないparagraphは無視する
      const firstChild = node.children[0].children[0];
      if (firstChild.type !== 'text') return;

      // prefixがない場合は対象外
      if (!firstChild.value.match(PREFIX_REGEX)) return;

      const prefix = firstChild.value;
      const alertType = getAlertLabel(prefix);

      if (!alertType) return;

      if (!node.properties) {
        node.properties = {};
      }

      node.properties = {
        className: 'gfm-alert',
        'data-alert-type': alertType.toLowerCase(),
      };

      // @ts-ignore blockquoteを<script type="application/json">に変更する
      node.tagName = 'script';
      node.properties.type = 'application/json';

      const alertText = node.children
        .map((child, index) => {
          if (child.type === 'element') {
            const content = removeLabelElement(child.children)
              .map((grandChild) => elementToHtml(grandChild))
              .join('');

            // 複数段落の場合、段落間に改行を入れる
            return index > 0 ? `\n\n${content}` : content;
          }
          return '';
        })
        .join('');

      node.children = [
        {
          type: 'text',
          value: JSON.stringify({
            type: 'alert',
            data: {
              type: alertType.toLowerCase(),
              text: alertText,
            },
          }),
        },
      ];
    });
  };
};

export default rehypeGfmAlert;

const getAlertLabel = (prefix: string): string => {
  if (PREFIX.includes(prefix)) {
    return prefix.replace('[!', '').replace(']', '');
  }

  return '';
};

/**
 * 要素を再帰的にHTMLに変換する
 */
const elementToHtml = (node: ElementContent): string => {
  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'element') {
    const childrenHtml = node.children.map((child) => elementToHtml(child)).join('');

    switch (node.tagName) {
      case 'a':
        return `<a href="${node.properties?.href ?? ''}">${childrenHtml}</a>`;
      case 'img':
        return `<img src="${node.properties?.src ?? ''}" alt="${node.properties?.alt ?? ''}" />`;
      case 'br':
        return '<br />';
      case 'strong':
      case 'b':
        return `<strong>${childrenHtml}</strong>`;
      case 'em':
      case 'i':
        return `<em>${childrenHtml}</em>`;
      case 'code':
        return `<code>${childrenHtml}</code>`;
      case 'del':
      case 's':
        return `<del>${childrenHtml}</del>`;
      case 'sup':
        return `<sup>${childrenHtml}</sup>`;
      case 'sub':
        return `<sub>${childrenHtml}</sub>`;
      default:
        return childrenHtml;
    }
  }

  return '';
};

const removeLabelElement = (nodes: ElementContent[]): ElementContent[] => {
  let breakPosition = 0;

  return nodes.filter((node, index) => {
    if (breakPosition === -1) return true;

    // 最初のラベルを取り除く
    if (node.type === 'text' && PREFIX.includes(node.value)) {
      breakPosition = index;
      return false;
    }

    // ラベルの次の改行を取り除く
    if (index === breakPosition + 1 && node.type === 'element' && node.tagName === 'br') {
      breakPosition = -1;
      return false;
    }

    return true;
  });
};
