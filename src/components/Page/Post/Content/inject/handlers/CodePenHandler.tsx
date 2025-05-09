import { Text } from 'html-react-parser';
import type { HandlerFunction } from '../types';

/**
 * CodePen埋め込みのハンドラー
 * CodePenのiframeを処理し、ハイドレーション時のエスケープ文字不一致を防止する
 * @param domNode - 処理対象のDOMノード
 * @returns 処理済みのDOMノードまたはundefined
 */
export const handleCodePen: HandlerFunction = (domNode) => {
  // CodePenのiframeを処理する
  if (
    domNode.tagName === 'iframe' &&
    typeof domNode.attribs?.src === 'string' &&
    domNode.attribs.src.includes('//codepen.io') &&
    domNode.children[0] instanceof Text
  ) {
    // ハイドレーション時にエスケープ文字が不一致しない場合があるため埋める
    domNode.children[0].data = 'CodePen';

    // 元のDOMノードを使用するため、undefinedを返す
    return undefined;
  }

  return undefined;
};
