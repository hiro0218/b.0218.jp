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
} & LinkProps &
  ContentProp;

export function Anchor({ href, prefetch = false, title = undefined, children, ...rest }: Props) {
  return (
    <Link href={href} {...(!prefetch && { prefetch: false })} title={title} {...rest}>
      {children}
    </Link>
  );
}
