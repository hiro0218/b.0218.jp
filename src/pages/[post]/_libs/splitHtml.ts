import type { ReactElement, ReactNode } from 'react';
import React from 'react';

type ReturnType = {
  before: ReactNode;
  after: ReactNode;
};

export function splitReactNode(node: ReactNode): ReturnType {
  const children = React.Children.toArray(node);
  let h2Count = 0;
  let splitIndex = -1;

  // 子要素をループして、2番目の h2 要素のインデックスを見つける
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (h2Count < 2 && React.isValidElement(child) && (child as ReactElement).type === 'h2') {
      h2Count++;
      if (h2Count === 2) {
        splitIndex = i;
        break;
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
