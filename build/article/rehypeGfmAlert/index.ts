import type { ElementContent } from 'hast';
import { isElement } from 'hast-util-is-element';
import { toHtml } from 'hast-util-to-html';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { ALERT_KINDS, type AlertKind, GFM_ALERT_CLASS_NAME, serializeAlertData } from '@/lib/domain/embeddedContent';
import { isElementNode, isTextNode } from '../hastUtils';

// ラベルの文字列を、ALERT_KINDS とは別にここへ並べない。並べると、綴りの違う種別が型を通る。runtime の検証で弾かれ、記事の alert が消える
const ALERT_KIND_BY_LABEL = new Map<string, AlertKind>(ALERT_KINDS.map((kind) => [`[!${kind.toUpperCase()}]`, kind]));

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
      node.children = node.children.filter((child) => !(isTextNode(child) && child.value === '\n'));

      // 空のブロッククオートは対象外
      if (node.children.length === 0) return;

      // 最初の要素は必ずparagraphである必要がある
      if (!isElement(node.children[0], 'p')) return;

      // 空のparagraphは対象外
      if (node.children[0].children.length === 0) return;

      // プレーンテキストで始まらないparagraphは無視する
      const firstChild = node.children[0].children[0];
      if (!isTextNode(firstChild)) return;

      // アラートラベルでない場合は対象外
      const alertKind = ALERT_KIND_BY_LABEL.get(firstChild.value);

      if (!alertKind) return;

      if (!node.properties) {
        node.properties = {};
      }

      node.properties = {
        className: [GFM_ALERT_CLASS_NAME],
        'data-alert-type': alertKind,
      };

      // @ts-ignore blockquoteを<script type="application/json">に変更する
      node.tagName = 'script';
      node.properties.type = 'application/json';

      const alertText = node.children
        .map((child, index) => {
          if (isElementNode(child)) {
            const content = toHtml(removeLabelElement(child.children));

            // 複数段落の場合、段落間に改行を入れる
            return index > 0 ? `\n\n${content}` : content;
          }
          return '';
        })
        .join('');

      node.children = [
        {
          type: 'text',
          value: serializeAlertData({
            type: alertKind,
            text: alertText,
          }),
        },
      ];
    });
  };
};

export default rehypeGfmAlert;

const removeLabelElement = (nodes: ElementContent[]): ElementContent[] => {
  let labelIndex = -1;

  return nodes.filter((node, index) => {
    // 既にラベルと改行を処理済み
    if (labelIndex !== -1 && index > labelIndex + 1) return true;

    // 最初のラベルを取り除く
    if (labelIndex === -1 && isTextNode(node) && ALERT_KIND_BY_LABEL.has(node.value)) {
      labelIndex = index;
      return false;
    }

    // ラベルの次の改行を取り除く
    if (labelIndex !== -1 && index === labelIndex + 1 && isElementNode(node) && node.tagName === 'br') {
      return false;
    }

    return true;
  });
};
