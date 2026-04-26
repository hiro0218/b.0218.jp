import { Text } from 'html-react-parser';
import type { Mutator } from './types';

/**
 * CodePen の iframe を検出して firstChild のテキストを埋め、
 * ハイドレーション時のエスケープ文字不一致を防ぐ。
 */
export const handleCodePen: Mutator = (domNode) => {
  const isCodePenIframe =
    domNode.tagName === 'iframe' &&
    typeof domNode.attribs?.src === 'string' &&
    domNode.attribs.src.includes('//codepen.io');

  const firstChild = domNode.children[0];

  if (isCodePenIframe && firstChild instanceof Text) {
    firstChild.data = 'CodePen';
  }
};
