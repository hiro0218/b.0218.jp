import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { Tooltip } from '@/components/UI/Tooltip';
import { css, cx } from '@/ui/styled';

type CommonProps = {
  'aria-label': string;
  children: ReactNode;
  /** ホバー時のツールチップ文字列。指定すると Tooltip でラップする */
  tooltip?: string;
  /** メニュー展開中などに hover overlay を強制表示する */
  'data-active'?: boolean;
  /** 一辺サイズ。'md' = 48px（既定）、'touch' = 44px（コンパクトな配置でのタッチターゲット） */
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
 * `size` で一辺を 48px（既定）/ 44px（touch）に切り替える。
 * @summary 円形アイコンボタン（button / 内部リンク / 外部リンク）
 */
export function IconButton(props: IconButtonProps) {
  const inner = renderInner(props);
  return props.tooltip ? <Tooltip text={props.tooltip}>{inner}</Tooltip> : inner;
}

function renderInner(props: IconButtonProps) {
  if (props.as === 'link') return renderLink(props);
  if (props.as === 'externalLink') return renderExternalLink(props);
  return renderButton(props);
}

function renderButton(props: ButtonProps) {
  const { tooltip, as, className, children, ref, size, type = 'button', ...rest } = props;
  return (
    <button
      className={cx('link-style--hover-effect', IconButtonStyle, className)}
      data-size={size === 'touch' ? size : undefined}
      ref={ref}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}

function renderLink(props: LinkProps) {
  const { tooltip, as, className, children, href, prefetch, size, ...rest } = props;
  return (
    <Anchor
      className={cx('link-style--hover-effect', IconButtonStyle, className)}
      data-size={size === 'touch' ? size : undefined}
      href={href}
      prefetch={prefetch}
      {...rest}
    >
      {children}
    </Anchor>
  );
}

function renderExternalLink(props: ExternalLinkProps) {
  const { tooltip, as, className, children, ref, href, size, ...rest } = props;
  return (
    <a
      className={cx('link-style--hover-effect', IconButtonStyle, className)}
      data-size={size === 'touch' ? size : undefined}
      href={href}
      ref={ref}
      {...rest}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

const IconButtonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--sizes-icon-sm) * 2);
  height: calc(var(--sizes-icon-sm) * 2);
  color: var(--colors-gray-1000);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radii-full);
  transition: transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &::after {
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

  &[data-active='true']::after {
    background-color: var(--colors-gray-a-200);
    opacity: 1;
    transform: scale(1);
  }
`;
