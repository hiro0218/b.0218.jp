import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { Tooltip } from '@/components/UI/Tooltip';
import { css, cx } from '@/ui/styled';

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

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | 'ref' | 'dangerouslySetInnerHTML'> & {
    as?: 'button';
    ref?: Ref<HTMLButtonElement>;
  };

type LinkProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | 'href' | 'target' | 'rel' | 'ref' | 'dangerouslySetInnerHTML'
  > & {
    as: 'link';
    href: string;
    prefetch?: boolean;
  };

type ExternalLinkProps = CommonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | 'href' | 'target' | 'rel' | 'ref' | 'dangerouslySetInnerHTML'
  > & {
    as: 'externalLink';
    href: string;
    ref?: Ref<HTMLAnchorElement>;
  };

export type IconButtonProps = ButtonProps | LinkProps | ExternalLinkProps;

/**
 * アイコン 1 つを内包する円形の操作要素。`as` で `<button>` / 内部リンク / 外部リンクを切り替える。
 * hover / focus / `data-active='true'` で半透明グレーのオーバーレイがスケールアニメーションで現れる。
 * @summary 円形アイコンボタン（button / 内部リンク / 外部リンク）
 */
export function IconButton({ tooltip, className, size, ...element }: IconButtonProps) {
  const shared = {
    className: cx('link-style--hover-effect', IconButtonStyle, className),
    'data-size': size === 'touch' ? size : undefined,
  };

  let inner: ReactNode;
  if (element.as === 'link') {
    const { as, ...rest } = element;
    inner = <Link {...shared} {...rest} />;
  } else if (element.as === 'externalLink') {
    const { as, ...rest } = element;
    inner = <a {...shared} {...rest} rel="noreferrer" target="_blank" />;
  } else {
    const { as, type = 'button', ...rest } = element;
    inner = <button {...shared} {...rest} type={type} />;
  }

  return tooltip ? <Tooltip text={tooltip}>{inner}</Tooltip> : inner;
}

const IconButtonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--control-min-size);
  height: var(--control-min-size);
  color: var(--colors-gray-1000);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radii-full);
  transition: transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &::before {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[data-size='touch'] {
    width: var(--sizes-touch-target);
    height: var(--sizes-touch-target);
  }

  &[data-active='true']::before {
    background-color: var(--colors-gray-a-200);
    opacity: 1;
    transform: scale(1);
  }
`;
