import { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

interface Props {
  href: ComponentProps<typeof Anchor>['href'];
  children: ReactNode;
}

const LinkMenu = ({ href, children }: Props) => {
  return <Link href={href}>{children}</Link>;
};

export default LinkMenu;

export const LinkStyle = css`
  display: inline-flex;
  align-items: center;
  padding: var(--space-half) var(--space-1);
  border-radius: var(--border-radius-4);
  color: var(--text-12);
  font-size: var(--font-size-sm);

  &:hover {
    background-color: var(--component-backgrounds-3A);
  }
`;

const Link = styled(Anchor)`
  ${LinkStyle}
`;
