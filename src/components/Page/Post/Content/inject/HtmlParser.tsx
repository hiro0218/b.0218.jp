import reactHtmlParser, { Element, type HTMLReactParserOptions } from 'html-react-parser';
import { handleZoomImage } from '@/components/Page/Post/Content/inject/handlers/ZoomImageHandler';
import { handleAlert, handleAnchor, handleCodePen, handleLinkPreview } from './handlers';

/**
 * HTML文字列をReactコンポーネントに変換するパーサー
 * 各種ハンドラーを適用して特定の要素を対応するコンポーネントに変換する
 */

/**
 * 複数のハンドラーを順番に適用する関数
 * @param domNode - 処理対象のDOMノード
 * @returns 変換後のReactコンポーネントまたはDOMノード
 */
const applyHandlers = (domNode: Element) => {
  // 各ハンドラーを順番に適用し、結果が返された場合はその結果を返す
  return (
    handleAnchor(domNode) ||
    handleAlert(domNode) ||
    handleLinkPreview(domNode) ||
    handleCodePen(domNode) ||
    handleZoomImage(domNode) ||
    domNode
  );
};

/**
 * パーサーの設定オプション
 */
const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode.attribs)) {
      return domNode;
    }

    return applyHandlers(domNode);
  },
};

/**
 * HTML文字列をReactコンポーネントに変換する関数
 * @param content - 変換対象のHTML文字列
 * @returns 変換後のReactノード配列
 */
export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
