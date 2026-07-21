import type { ReactNode } from 'react';
import { css } from '@/ui/styled';
import { ScrollProgressBar } from './ScrollProgress/Bar';

const SCROLL_PROGRESS_TARGET_ATTR = 'data-scroll-progress-target';

/**
 * 読み進め状況の起点・終点として扱う対象要素に付与する class である。
 * CSS の view-timeline 起点として使うため、対象要素には scrollProgressTargetAttrs と
 * セットで付与する必要がある。
 */
export const scrollProgressTarget = css`
  view-timeline-name: --scroll-progress;
`;

/**
 * 対象要素を JS 側（非対応ブラウザ向けフォールバック）が検索するための data 属性である。
 * scrollProgressTarget class とセットで、対象要素に spread で付与する。
 *
 * @remarks
 * クラス名は Panda CSS が生成するスタイリング用の実装詳細であり、DOM 検索のキーとして
 * 転用すると CSS 側の変更に JS 側が引きずられる。検索用の識別子は data 属性として分離する。
 */
export const scrollProgressTargetAttrs = {
  [SCROLL_PROGRESS_TARGET_ATTR]: '',
};

/**
 * scrollProgressTarget class を付与した要素の読み進め状況を示すスクロール進捗インジケーターである。
 * ページ上部に固定表示する。
 */
export function ScrollProgress(): ReactNode {
  return <ScrollProgressBar targetAttr={SCROLL_PROGRESS_TARGET_ATTR} />;
}
