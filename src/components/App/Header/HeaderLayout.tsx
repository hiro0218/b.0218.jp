import type { ReactNode } from 'react';

import useIsMounted from '@/hooks/useIsMounted';
import { css, styled } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';

type Props = {
  children: ReactNode;
};

export function HeaderLayout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderScrollHandler();

  return (
    <div className={underlineStyle}>
      <Header data-floating data-is-hide={!isHeaderShown} data-is-mounted={isMounted}>
        {children}
      </Header>
    </div>
  );
}

const underlineStyle = css`
  height: var(--spacing-5);
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-header);
  height: var(--spacing-5);
  margin: 0 auto;
  pointer-events: none;
  isolation: isolate;
  transition:
    transform 0.2s var(--easings-ease-out-expo),
    opacity 0.2s var(--easings-ease-out-expo);

  &[data-is-mounted='true'] {
    opacity: 1;
    transform: translateY(0);

    &[data-is-hide='true'] {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
`;
