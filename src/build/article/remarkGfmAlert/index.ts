import type { Blockquote } from 'mdast';
import type { Plugin } from 'unified';
import type { Parent } from 'unist';
import { visit } from 'unist-util-visit';

type PrefixProps = '[!NOTE]' | '[!IMPORTANT]' | '[!WARNING]' | '';

const remarkGfmAlert: Plugin = () => {
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
  switch (prefix.toUpperCase()) {
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
      <div class="gfm-alert" data-alert-type="${alertLabel.toLowerCase()}">
        <p>
          <span class="gfm-alert-title">${toUpperFirstLetter(alertLabel)}</span><br>
          ${value.replace(prefix, '').trim()}
        </p>
      </div>`.trim(),
  };
};

const toUpperFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
};
