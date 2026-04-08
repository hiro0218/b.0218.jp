import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { ReactNode } from 'react';

type ContentProp =
  | {
      children: ReactNode;
      dangerouslySetInnerHTML?: never;
    }
  | {
      children?: never;
      dangerouslySetInnerHTML: {
        __html: string;
      };
    };

type Props = {
  title?: string;
  className?: string;
} & LinkProps &
  ContentProp;

/**
 * Next.js Link のラッパー。内部・外部リンクを統一的に扱う。
 * ナビゲーション用途で使用し、ボタン操作には Button を使う。
 * @summary 内部・外部リンクの統一ラッパー
 */
export function Anchor({ href, className, prefetch = false, title = undefined, children, ...rest }: Props) {
  return (
    <Link className={className} href={href} prefetch={prefetch || undefined} {...(title && { title })} {...rest}>
      {children}
    </Link>
  );
}
