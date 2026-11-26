import { findAndReplace, type ReplaceFunction } from 'mdast-util-find-and-replace';

type Nodes = Parameters<typeof findAndReplace>[0];

// g フラグ付きだが、mdast-util-find-and-replace は使用直前に lastIndex を 0 にリセットするため
// module scope での共有は安全（node_modules/mdast-util-find-and-replace/lib/index.js の handler 実装で確認済み）。
const BREAK_PATTERN = /\r?\n|\r/g;

/**
 * Plugin to transform newlines into breaks.
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function newlineToBreak() {
  return (tree: Nodes) => {
    findAndReplace(tree, [BREAK_PATTERN, replace as ReplaceFunction]);
  };
}

function replace() {
  return { type: 'break' };
}
