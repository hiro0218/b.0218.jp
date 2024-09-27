import { findAndReplace, type ReplaceFunction } from 'mdast-util-find-and-replace';

type Nodes = Parameters<typeof findAndReplace>[0];

/**
 * Plugin to transform newlines into breaks.
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function newlineToBreak() {
  return (tree: Nodes) => {
    findAndReplace(tree, [/\r?\n|\r/g, replace as ReplaceFunction]);
  };
}

function replace() {
  return { type: 'break' };
}
