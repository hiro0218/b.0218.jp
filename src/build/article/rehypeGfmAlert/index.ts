import type { ElementContent } from 'hast';
import { isElement } from 'hast-util-is-element';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const PREFIX_REGEX = /\[!(?<kind>[\w]+)\](?<collapsable>-{0,1})\s*(?<title>.*)/g;
const PREFIX = ['[!NOTE]', '[!IMPORTANT]', '[!WARNING]', '[!TIP]', '[!CAUTION]'];

const rehypeGfmAlert: Plugin = () => {
  return (tree) => {
    visit(tree, (node) => {
      // blockquoteだけをパースする
      if (!isElement(node, 'blockquote')) return;

      // 不要なノードを削除する
      node.children = node.children.filter((c) => !(c.type === 'text' && c.value === '\n'));

      // 空のブロッククオートは対象外
      if (node.children.length === 0) return;

      // 最初の要素は必ずparagraphである必要がある
      if (!isElement(node.children[0], 'p')) return;

      // 空のparagraphは対象外
      if (node.children[0].children.length === 0) return;

      // プレーンテキストで始まらないparagraphは無視する
      const firstNode = node.children[0].children[0];
      if (firstNode.type !== 'text') return;

      // prefixがない場合は対象外
      if (!firstNode.value.match(PREFIX_REGEX)) return;

      const prefix = firstNode.value;
      const label = getAlertLabel(prefix);

      if (!label) return;

      if (!node.properties) {
        node.properties = {};
      }

      node.properties = {
        className: 'gfm-alert',
        'data-alert-type': label.toLowerCase(),
      };

      // @ts-ignore blockquoteをdivに変更する
      node.tagName = 'div';

      // Prefixなラベルを付与したので重複した部分を削除する
      node.children[0].children = removeLabelElement(node.children[0].children);

      node.children = [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'gfm-alert-title',
          },
          children: [
            {
              type: 'text',
              value: toUpperFirstLetter(label),
            },
          ],
        },
        ...node.children,
      ];
    });
  };
};

export default rehypeGfmAlert;

const getAlertLabel = (prefix: string) => {
  if (PREFIX.includes(prefix)) {
    return prefix.replace('[!', '').replace(']', '');
  }

  return '';
};

const toUpperFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
};

const removeLabelElement = (node: ElementContent[]) => {
  let breakPosition = 0;

  return node.filter((c, i) => {
    if (breakPosition === -1) return true;

    // 最初のラベルを取り除く
    if (c.type === 'text' && PREFIX.includes(c.value)) {
      breakPosition = i;
      return false;
    }

    // ラベルの次の改行を取り除く
    if (i === breakPosition + 1 && c.type === 'element' && c.tagName === 'br') {
      breakPosition = -1;
      return false;
    }

    return true;
  });
};
