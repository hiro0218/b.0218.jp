import type { ReactElement, ReactNode } from 'react';
import React from 'react';

export function splitReactNode(node: ReactNode): { before: ReactNode; after: ReactNode } {
  const children = React.Children.toArray(node);
  let h2Count = 0;
  let splitIndex = -1;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (React.isValidElement(child) && (child as ReactElement).type === 'h2') {
      h2Count++;
      if (h2Count === 2) {
        splitIndex = i;
        break;
      }
    }
  }

  if (splitIndex === -1) {
    return { before: node, after: null };
  }

  return {
    before: children.slice(0, splitIndex),
    after: children.slice(splitIndex),
  };
}
