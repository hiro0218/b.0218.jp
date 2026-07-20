import { Children, isValidElement, type ReactNode } from 'react';

const MIN_HEADINGS_FOR_SINGLE_AD = 2;
const MIN_HEADINGS_FOR_SECOND_AD = 5;

function resolveAdCount(headingCount: number): number {
  if (headingCount < MIN_HEADINGS_FOR_SINGLE_AD) return 0;
  if (headingCount < MIN_HEADINGS_FOR_SECOND_AD) return 1;
  return 2;
}

/**
 * 本文を見出し(h2)数に応じてセクションに分割する。
 * 挿入位置を常に固定にすると見出しが多い記事ほど後半が広告空白地帯になるため、
 * 見出し数に応じて分割数(0〜2本)をスケーリングし、見出しを均等分割した境界に置く。
 *
 * @param node - 分割対象のReactNode(トップレベルの子要素を持つ配列を想定)
 * @returns 本文セクションの配列(要素数 - 1 が本文中広告の本数)
 */
export function splitContentForAds(node: ReactNode): ReactNode[] {
  // html-react-parser は複数ブロックの本文を常にフラットな ReactNode[] (要素はkey付与済み)で
  // 返すため、配列であれば Children.toArray による全要素の再クローンを避けて直接使う
  const children = Array.isArray(node) ? (node as ReactNode[]) : Children.toArray(node);
  if (children.length === 0) {
    return [];
  }

  const headingIndexes: number[] = [];
  children.forEach((child, i) => {
    if (isValidElement(child) && child.type === 'h2') {
      headingIndexes.push(i);
    }
  });

  const adCount = resolveAdCount(headingIndexes.length);

  if (adCount === 0) {
    return [children];
  }

  // 見出しを (adCount + 1) グループに均等分割する境界の見出しインデックスを選ぶ
  const splitPoints = Array.from({ length: adCount }, (_, i) => {
    const headingPosition = Math.round(((i + 1) * headingIndexes.length) / (adCount + 1));
    return headingIndexes[headingPosition];
  });

  const sections: ReactNode[] = [];
  let start = 0;
  for (const point of splitPoints) {
    sections.push(children.slice(start, point));
    start = point;
  }
  sections.push(children.slice(start));

  return sections;
}
