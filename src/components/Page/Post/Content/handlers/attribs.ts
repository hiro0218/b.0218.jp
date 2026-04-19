import { attributesToProps, type Element } from 'html-react-parser';

/**
 * html-react-parser の Element から React 用 props を生成する。
 * ユーザー起源の HTML で dangerouslySetInnerHTML が生成されるのを防ぐため除外する。
 */
export function toSafeProps(node: Element) {
  const { dangerouslySetInnerHTML, ...props } = attributesToProps(node.attribs, node.name);
  return props;
}
