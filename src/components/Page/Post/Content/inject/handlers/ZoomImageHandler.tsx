import type { Element } from 'html-react-parser';
import type { HandlerFunction } from '../types';
import ZoomImage from './ZoomImage';

/**
 * 画像要素をZoomImage処理するハンドラー
 * リンク（aタグ）内の画像は処理しない
 * @param domNode - 処理対象のDOMノード
 * @returns ZoomImageコンポーネントまたはundefined
 */
export const handleZoomImage: HandlerFunction = (domNode) => {
  if (domNode.tagName === 'img') {
    // aタグ内にある画像は処理しない
    if (isInsideAnchor(domNode)) {
      return undefined;
    }

    const attribs = domNode.attribs || {};
    const { src, alt = '', ...rest } = attribs;

    if (!src) {
      return undefined;
    }

    return <ZoomImage src={src} alt={alt} {...rest} />;
  }

  return undefined;
};

/**
 * 要素がアンカータグ内にあるかどうかを判定する
 * @param element - 確認対象の要素
 * @returns アンカータグ内にある場合はtrue、そうでない場合はfalse
 */
function isInsideAnchor(element: Element): boolean {
  // parent属性がある場合
  if ('parent' in element && element.parent) {
    // 親がaタグの場合はtrue
    if (element.parent.type === 'tag' && element.parent.name === 'a') {
      return true;
    }

    // 親の親も確認（ネストされたケース）
    if ('parent' in element.parent && element.parent.parent) {
      return element.parent.parent.type === 'tag' && element.parent.parent.name === 'a';
    }
  }

  return false;
}
