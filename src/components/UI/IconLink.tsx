'use client';

// Server Component にしない。Server Component が作った要素は lazy の node で届くことがあり、Tooltip が cloneElement すると type が undefined になる（Element type is invalid）ため

import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';

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

type AnchorProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | 'href' | 'target' | 'rel' | 'ref' | 'dangerouslySetInnerHTML'
  > & {
    href: string;
  };

type LinkProps = AnchorProps & {
  as: 'link';
  prefetch?: boolean;
};

type ExternalLinkProps = AnchorProps & {
  as: 'externalLink';
  ref?: Ref<HTMLAnchorElement>;
};

export type IconLinkProps = LinkProps | ExternalLinkProps;

/**
 * アイコン 1 つを内包する円形のリンク。`as` で内部リンク（Next.js の Link）と外部リンク（新しいタブで開く `<a>`）を切り替える。
 * hover / focus / `data-active='true'` で半透明グレーのオーバーレイがスケールアニメーションで現れる。
 * @summary 円形アイコンリンク（内部リンク / 外部リンク）
 */
export function IconLink({ tooltip, className, size, ...element }: IconLinkProps) {
  const shared = {
    className: cx('link-style--hover-effect', iconControl, className),
    'data-size': size === 'touch' ? size : undefined,
  };

  let inner: ReactNode;
  if (element.as === 'link') {
    const { as, ...rest } = element;
    inner = <Link {...shared} {...rest} />;
  } else {
    const { as, ...rest } = element;
    inner = <a {...shared} {...rest} rel="noreferrer" target="_blank" />;
  }

  return tooltip ? <Tooltip text={tooltip}>{inner}</Tooltip> : inner;
}
