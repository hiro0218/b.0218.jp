import type { ReactNode } from 'react';
import { css, cx, styled } from '@/ui/styled';

type Props = {
  /** コンテナの最大幅バリアント */
  size?: 'default' | 'large';
  children: ReactNode;
  className?: string;
};

const sizeStyles = {
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

/**
 * 左右の余白は、幅を 90vw（上限つき）にして生まれる端の隙間だけで作る。
 * 内側に padding を足さない。足すと、隙間が二重になり、本文の端がヘッダーのロゴや検索アイコンの端とそろわない。
 * @summary ページ幅制御コンテナ（default/large）
 */
export function Container({ size = 'default', children, className }: Props): ReactNode {
  return <Root className={cx(className, sizeStyles[size])}>{children}</Root>;
}
