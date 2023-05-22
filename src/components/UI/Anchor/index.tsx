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

export const Anchor = ({ href, prefetch = false, passHref, title, children, ...rest }: Props) => (
  <Link href={href} {...(!prefetch && { prefetch: false })} passHref={passHref} title={title} {...rest}>
    {children}
  </Link>
);
