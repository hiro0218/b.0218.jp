import { type DOMNode, domToReact } from 'html-react-parser';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode) => {
  if (domNode.name === 'table') {
    // style属性を除外（文字列として渡されるとReactがエラーをスローする）
    const { style, ...restAttribs } = domNode.attribs || {};

    return (
      <div className="c-table-scrollable">
        <table {...restAttribs}>{domToReact(domNode.children as DOMNode[])}</table>
      </div>
    );
  }

  return undefined;
};
