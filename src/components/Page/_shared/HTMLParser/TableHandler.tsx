import { type DOMNode, domToReact } from 'html-react-parser';
import { toSafeProps } from './attribs';
import type { Replacer } from './types';

export const handleTable: Replacer = (domNode, options) => {
  if (domNode.name !== 'table') {
    return undefined;
  }

  // tabIndex を付けるのは、あふれたときだけにしない。あふれるかは画面の幅で変わる。判定に client の計測が要るため、サーバーの描画では決められない
  return (
    // biome-ignore lint/a11y/useSemanticElements: <section> に替えると、引用の中の表が post-content の blockquote > :is(p, div) の余白の規則から外れて間隔が変わる
    // biome-ignore lint/a11y/noNoninteractiveTabindex: 横にスクロールする箱は、キーボードで焦点が入らないと矢印キーでスクロールできない（axe: scrollable-region-focusable）
    <div aria-label="表" className="c-table-scrollable" role="region" tabIndex={0}>
      <table {...toSafeProps(domNode)}>{domToReact(domNode.children as DOMNode[], options)}</table>
    </div>
  );
};
