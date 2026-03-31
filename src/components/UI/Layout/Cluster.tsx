import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';

import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap;
  role?: AriaRole;
  /** 子要素を flex: 1 1 auto で均等に伸縮させる */
  isWide?: boolean;
  className?: string;
  children: ReactNode;
};

const clusterStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--cluster-gap);
  justify-content: flex-start;
`;

const wideStyle = css`
  align-content: start;

  & > * {
    flex: 1 1 auto;
  }
`;

/**
 * 横並びで自動折り返しするレイアウト。タグやバッジ等の可変個数の要素に使用する。
 * @summary 横並び自動折り返しレイアウト
 */
export function Cluster({ as: Tag = 'div', children, isWide, gap = 1, className, ...props }: Props) {
  const style = { '--cluster-gap': `var(--spacing-${gap})` } as CSSProperties;

  return (
    <Tag className={cx(className, clusterStyle, isWide && wideStyle)} style={style} {...props}>
      {children}
    </Tag>
  );
}
