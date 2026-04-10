import type { CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type CenterProps = {
  as?: keyof JSX.IntrinsicElements;
  maxWidth?: string;
  minWidth?: string;
  /** 左右の内側余白（padding-inline） */
  gutters?: SpaceGap;
  /** flex column + align center による内在的な中央揃え */
  intrinsic?: boolean;
  className?: string;
  children: ReactNode;
};

const centerStyle = css`
  box-sizing: content-box;
  max-inline-size: var(--center-max-width);
  padding-inline: var(--center-gutters, 0);
  margin-inline: auto;
`;

const intrinsicStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * コンテンツを水平方向に中央揃えするレイアウトコンポーネント。
 * max-width と margin auto で中央配置する。
 * @summary 水平中央揃えレイアウト
 */
export const Center = ({
  as: Tag = 'div',
  maxWidth = '80rem',
  minWidth = '16rem',
  gutters,
  intrinsic = false,
  className,
  children,
  ...props
}: CenterProps) => {
  const style = {
    '--center-max-width': `clamp(${minWidth}, 100%, ${maxWidth})`,
    ...(gutters !== undefined && { '--center-gutters': `var(--spacing-${gutters})` }),
  } as CSSProperties;

  return (
    <Tag className={cx(className, centerStyle, intrinsic && intrinsicStyle)} style={style} {...props}>
      {children}
    </Tag>
  );
};
