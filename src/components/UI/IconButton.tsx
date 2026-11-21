'use client';

// Server Component にしない。Server Component が作った要素は lazy の node で届くことがあり、Tooltip が cloneElement すると type が undefined になる（Element type is invalid）ため

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { Tooltip } from '@/components/UI/Tooltip';
import { cx } from '@/ui/styled';
import { iconControl } from '@/ui/styled/components/iconControl';

type CommonProps = {
  'aria-label': string;
  children: ReactNode;
  /** ホバー時のツールチップ文字列。指定すると Tooltip でラップする */
  tooltip?: string;
  /** メニュー展開中などに hover overlay を強制表示する */
  'data-active'?: boolean;
  /** 一辺の長さ。'md'（既定）はタッチの画面 44px・マウスの画面 36px、'touch' は常に 44px（コンパクトな配置でのタッチターゲット） */
  size?: 'md' | 'touch';
  /** state-based color など、配置先固有の追加スタイル */
  className?: string;
};

export type IconButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | 'ref' | 'dangerouslySetInnerHTML'> & {
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * アイコン 1 つを内包する円形の `<button>`。
 * hover / focus / `data-active='true'` で半透明グレーのオーバーレイがスケールアニメーションで現れる。
 * ページを移動する操作には使わず、IconLink にする。見た目がボタンでも、移動は `<a>` で表すため。
 * @summary 円形アイコンボタン
 */
export function IconButton({ tooltip, className, size, type = 'button', ...element }: IconButtonProps) {
  const inner = (
    <button
      className={cx('link-style--hover-effect', iconControl, className)}
      data-size={size === 'touch' ? size : undefined}
      {...element}
      type={type}
    />
  );

  return tooltip ? <Tooltip text={tooltip}>{inner}</Tooltip> : inner;
}
