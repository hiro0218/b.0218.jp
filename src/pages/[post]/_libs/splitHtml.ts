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

export function splitHtml(html: string): { before: string; after: string } {
  const regex = /<h2\b[^>]*>(.*?)<\/h2>/gi;
  const matches = html.match(regex);

  if (!matches || matches.length < 2) {
    // 2番目の<h2>が見つからない場合
    return {
      before: html,
      after: '',
    };
  }

  // 2番目の<h2>までの位置を取得
  const splitIndex = html.indexOf(matches[1]);

  if (splitIndex !== -1) {
    return {
      before: html.substring(0, splitIndex),
      after: html.substring(splitIndex),
    };
  }

  return {
    before: html,
    after: '',
  };
}
