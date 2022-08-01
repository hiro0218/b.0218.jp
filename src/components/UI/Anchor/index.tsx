import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & LinkProps;

export const Anchor = ({ href, prefetch = false, passHref, children, ...rest }: Props) => (
  <Link href={href} prefetch={prefetch} passHref={passHref} {...rest}>
    {children}
  </Link>
);
