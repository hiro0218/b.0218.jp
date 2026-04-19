import type { Element } from 'html-react-parser';
import { ZoomImage } from '@/components/UI/ZoomImage';
import { toSafeProps } from '../attribs';
import type { HandlerFunction } from '../types';

/**
 * img タグを ZoomImage に変換するハンドラー
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

  const src = domNode.attribs?.src;

  if (!src) {
    return undefined;
  }

  const { alt, ...props } = toSafeProps(domNode);

  return <ZoomImage {...props} alt={typeof alt === 'string' ? alt : ''} src={src} />;
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
  if (typeof node !== 'object' || node === null) {
    return false;
  }

  const element = node as Partial<Element>;
  return element.type === 'tag' && typeof element.name === 'string';
}
