import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/ui/styled';
import type { FlexAlign, FlexJustify, FlexWrap } from '@/ui/styled/atomic';
import {
  alignClasses,
  directionClasses,
  flexBaseStyle,
  gapClasses,
  justifyClasses,
  wrapClasses,
} from '@/ui/styled/atomic';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props<T extends ElementType = 'div'> = {
  as?: T;
  /**
   * 子要素間のスペース（gap）
   *
   * @remarks
   * - デフォルト値は `2` (8px)
   * - `gap={0}` は特定のユースケース（タイトなレイアウト）でのみ使用すること
   * - Zero Margin Principle: 子要素は自身のマージンを持たず、親の gap で間隔を制御
   *
   * @example
   * ```tsx
   * // 通常のスペース
   * <Stack gap={4}>
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
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'gap' | 'direction' | 'align' | 'justify' | 'wrap'>;

export const Stack = <T extends ElementType = 'div'>({
  as,
  children,
  direction = 'vertical',
  gap = 2,
  align,
  justify,
  wrap,
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
        wrap && wrapClasses[wrap],
        gapClasses[gap],
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
