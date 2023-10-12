import type { Blockquote } from 'mdast';
import type { Plugin } from 'unified';
import type { Parent } from 'unist';
import { visit } from 'unist-util-visit';

type PrefixProps = '[!NOTE]' | '[!IMPORTANT]' | '[!WARNING]' | '';

export const remarkGfmAlert: Plugin = () => {
  return (tree) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent: Parent) => {
      const firstChild = node.children[0];

      if (firstChild.type !== 'paragraph' || firstChild.children[0]?.type !== 'text') return;

      const { value } = firstChild.children[0];
      const prefix = `${value.split(']')[0]}]` as PrefixProps;
      const alertLabel = getAlertLabel(prefix);

      if (!alertLabel) return;

      const htmlNode = getHtmlNode(prefix, alertLabel, value);

      parent.children.splice(index, 1, htmlNode);
    });
  };
};

export default remarkGfmAlert;

const getAlertLabel = (prefix: PrefixProps) => {
  switch (prefix) {
    case '[!NOTE]':
    case '[!IMPORTANT]':
    case '[!WARNING]':
      return prefix.replace('[!', '').replace(']', '');
    default:
      return '';
  }
};

const getHtmlNode = (prefix: PrefixProps, alertLabel: string, value: string) => {
  return {
    type: 'html',
    value: `
      <div class="alert">
        <p>
          <span class="alert-title__${alertLabel.toLowerCase()}">${alertLabel}</span><br>
          ${value.replace(prefix, '').trim()}
        </p>
      </div>`.trim(),
  };
};
