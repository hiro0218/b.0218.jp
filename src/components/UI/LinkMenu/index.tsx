import type { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { hoverLinkStyle } from '@/ui/mixin';
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
  color: var(--text-12);
  border-radius: var(--border-radius-4);

  ${hoverLinkStyle}
`;

const Link = styled(Anchor)`
  ${LinkStyle}
`;
