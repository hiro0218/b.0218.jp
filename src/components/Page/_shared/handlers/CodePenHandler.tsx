import type { Mutator } from './types';

type TextNode = { type: 'text'; data: string };

const isTextNode = (node: unknown): node is TextNode => {
  return typeof node === 'object' && node !== null && (node as { type?: unknown }).type === 'text';
};

/**
 * CodePen の iframe を検出して firstChild のテキストを書き換え、
 * ハイドレーション時のエスケープ文字不一致を防ぐ。
 *
 * html-react-parser から re-export される Text クラスは内部で使われる
 * インスタンスと一致しないため (instanceof は常に false)、type 文字列で判定する。
 */
export const handleCodePen: Mutator = (domNode) => {
  const isCodePenIframe =
    domNode.tagName === 'iframe' &&
    typeof domNode.attribs?.src === 'string' &&
    domNode.attribs.src.includes('//codepen.io');

  const firstChild = domNode.children[0];

  if (isCodePenIframe && isTextNode(firstChild)) {
    firstChild.data = 'CodePen';
  }
};
