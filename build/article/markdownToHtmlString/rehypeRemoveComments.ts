import type { Comment, Nodes, Root } from 'hast';
import { visit } from 'unist-util-visit';

const regex = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/;

const isConditionalComment = (node: Nodes) => node.type === 'comment' && regex.test(node.value);

export default function rehypeRemoveComments() {
  return function (tree: Root) {
    visit(tree, 'comment', function (node: Comment, index, parent) {
      if (typeof index === 'number' && parent && !isConditionalComment(node)) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}
