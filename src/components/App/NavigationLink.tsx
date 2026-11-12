'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';

type Props = {
  href: string;
  children: ReactNode;
  onClick?: () => void;
};

/**
 * @summary ナビゲーション項目（現在地つき）
 */
export function NavigationLink({ href, children, onClick }: Props) {
  const pathname = usePathname();
  // startsWith(href) だけにしない。/tags-old まで /tags の現在地になるため
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={cx(stateLayerControl, linkStyle)}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

// --navigation-link-padding の名前を変えない。Footer.tsx の Nav がこの名前で余白を上書きし、同じ値の負の margin で先頭の項目の左端をそろえているため
const linkStyle = css`
  padding-inline: var(--navigation-link-padding, var(--control-padding-inline));
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-sm);
`;
