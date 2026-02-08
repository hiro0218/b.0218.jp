import type { ReactNode } from 'react';
import React from 'react';

type SplitResult = {
  before: ReactNode;
  after: ReactNode;
};

/**
 * ReactNodeを2番目のh2要素の位置で分割する
 * コンテンツを前半と後半に分けて表示する際などに使用する
 *
 * @param node - 分割対象のReactNode
 * @returns 分割された前半部分と後半部分のオブジェクト
 * @example
 * const { before, after } = splitReactNode(articleContent);
 * return (
 *   <>
 *     <div className="first-part">{before}</div>
 *     <SomeComponent />
 *     <div className="second-part">{after}</div>
 *   </>
 * );
 */
export function splitReactNode(node: ReactNode): SplitResult {
  if (node === null || node === undefined) {
    return { before: null, after: null };
  }

  // 受け取ったReactNodeを配列形式に変換
  const children = React.Children.toArray(node);

  if (children.length === 0) {
    return { before: null, after: null };
  }

  let h2Count = 0;
  let splitIndex = -1;

  // 一度の走査で2番目のh2要素を見つける
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (React.isValidElement(child) && child.type === 'h2') {
      h2Count++;
      if (h2Count === 2) {
        splitIndex = i;
        break; // 2番目のh2が見つかったらループを終了
      }
    }
  }

  // 2番目の h2 要素が見つからない場合、元のノードを返す
  if (splitIndex === -1) {
    return { before: node, after: null };
  }

  // 2番目の h2 要素でノードを分割して返す
  return {
    before: children.slice(0, splitIndex),
    after: children.slice(splitIndex),
  };
}
