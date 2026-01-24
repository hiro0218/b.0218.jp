import type { Root } from 'hast';
import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import { visit } from 'unist-util-visit';

const options = [
  {
    selector: 'table',
    wrapper: 'div.p-table-scroll',
  },
];

function transform(tree: Root, { selector, wrapper = 'div' }: { selector: string; wrapper: string }) {
  for (const match of selectAll(selector, tree)) {
    visit(tree, match, (node, i, parent) => {
      const wrap = parseSelector(wrapper);
      wrap.children = [node];
      parent.children[i] = wrap;
    });
  }
}

const _wrapAll = (tree: Root) => {
  for (let i = 0; i < options.length; i++) {
    transform(tree, options[i]);
  }
};
