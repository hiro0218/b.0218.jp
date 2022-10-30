import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
} & LinkProps;

export const Anchor = ({ href, prefetch = false, passHref, title, children, ...rest }: Props) => (
  <Link href={href} {...(!prefetch && { prefetch: false })} passHref={passHref} title={title} {...rest}>
    {children}
  </Link>
);
