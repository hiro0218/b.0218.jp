import type { Element } from 'html-react-parser';
import type { HandlerFunction } from '../types';
import ZoomImageModal from './ZoomImageModal';

/**
 * img タグを ZoomImageModal に変換するハンドラー
 *
 * @remarks リンク（aタグ）内の画像は変換しない
 */
export const handleZoomImage: HandlerFunction = (domNode) => {
  if (domNode.tagName !== 'img') {
    return undefined;
  }

  if (isInsideAnchor(domNode)) {
    return undefined;
  }

  const { src, alt = '', ...rest } = domNode.attribs ?? {};

  if (!src) {
    return undefined;
  }

  return <ZoomImageModal alt={alt} src={src} {...rest} />;
};

/**
 * 要素が a タグの内側にあるかを再帰的にチェック
 */
function isInsideAnchor(element: Element): boolean {
  const parent = element.parent;

  if (!parent || !isElement(parent)) {
    return false;
  }

  if (parent.name === 'a') {
    return true;
  }

  return isInsideAnchor(parent);
}

/**
 * html-react-parser の Node が Element 型かを判定
 */
function isElement(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as { type: string }).type === 'tag' &&
    'name' in node
  );
}
