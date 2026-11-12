import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/ui/styled';
import type { FlexAlign, FlexJustify } from '@/ui/styled/atomic/flex';
import { alignClasses, directionClasses, flexBaseStyle, justifyClasses } from '@/ui/styled/atomic/flex';
import { gapClasses } from '@/ui/styled/atomic/spacing';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props<T extends ElementType = 'div'> = {
  as?: T;
  /**
   * 子要素間のスペース（gap）
   *
   * @remarks
   * - デフォルト値は `300` (16px)
   * - `gap={0}` は特定のユースケース（タイトなレイアウト）でのみ使用すること
   * - Zero Margin Principle: 子要素は自身のマージンを持たず、親の gap で間隔を制御
   *
   * @example
   * ```tsx
   * // 通常のスペース
   * <Stack gap={600}>
   *   <Card />
   *   <Card />
   * </Stack>
   *
   * // タイトなレイアウト（明示的に gap=0 を指定）
   * <Stack gap={0}>
   *   <MenuItem />
   *   <MenuItem />
   * </Stack>
   * ```
   */
  gap?: SpaceGap | 0;
  direction?: 'vertical' | 'horizontal';
  /** 交差軸の配置 */
  align?: FlexAlign;
  /** 主軸の配置 */
  justify?: FlexJustify;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'gap' | 'direction' | 'align' | 'justify'>;

/**
 * 子要素を縦または横方向に並べるレイアウトコンポーネント。
 * gap でスペースを制御する（Zero Margin Principle）。
 * @summary 縦/横方向のスタックレイアウト
 */
export const Stack = <T extends ElementType = 'div'>({
  as,
  children,
  direction = 'vertical',
  gap = 300,
  align,
  justify,
  className,
  ...props
}: Props<T>) => {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cx(
        className,
        flexBaseStyle,
        directionClasses[direction],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        gapClasses[gap],
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
