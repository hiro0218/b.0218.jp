import type { ReactNode } from 'react';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  /** コンテナの最大幅バリアント */
  size?: 'small' | 'default' | 'large';
  /** 左右の内側余白を付与する */
  space?: boolean;
  children: ReactNode;
  className?: string;
};

const sizeStyles = {
  small: css`
    max-width: var(--sizes-container-sm);
  `,
  default: css`
    max-width: var(--sizes-container-md);
  `,
  large: css`
    max-width: var(--sizes-container-lg);
  `,
} as const;

const Root = styled.div`
  width: 100%;
  margin: auto;
`;

const spaceStyle = css`
  padding-block: 0;
  padding-inline: clamp(var(--spacing-2), 3vw, var(--spacing-3));
`;

/**
 * ページ幅を制御するコンテナ。3 段階のサイズバリアントを持つ。
 * @summary ページ幅制御コンテナ（small/default/large）
 */
export function Container({ size = 'default', space = true, children, className }: Props): ReactNode {
  return <Root className={cx(className, space && spaceStyle, sizeStyles[size])}>{children}</Root>;
}
