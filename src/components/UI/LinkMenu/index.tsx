import type { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

interface Props {
  href: ComponentProps<typeof Anchor>['href'];
  children: ReactNode;
}

function LinkMenu({ href, children }: Props) {
  return <Link href={href}>{children}</Link>;
}

export default LinkMenu;

export const LinkStyle = css`
  display: inline-flex;
  align-items: center;
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--text-12);
  border-radius: var(--border-radius-4);

  &:hover {
    background-color: var(--component-backgrounds-3A);
  }

  &:active {
    background-color: var(--component-backgrounds-4A);
  }
`;

const Link = styled(Anchor)`
  ${LinkStyle}
`;
