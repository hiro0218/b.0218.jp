import { type ReactNode, memo } from 'react';

import useIsMounted from '@/hooks/useIsMounted';
import { css, styled } from '@/ui/styled/dynamic';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo(function HeaderLayout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderScrollHandler();

  return (
    <Underline>
      <Header data-is-hide={!isHeaderShown} data-floating isMounted={isMounted()}>
        {children}
      </Header>
    </Underline>
  );
});

const Underline = styled.div`
  height: var(--space-5);
`;

const Header = styled.header<{ isMounted: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--zIndex-header);
  height: var(--space-5);
  margin: 0 auto;
  pointer-events: none;
  isolation: isolate;
  will-change: opacity;

  ${({ isMounted }) => {
    if (!isMounted) {
      return '';
    }

    return css`
      animation: fadeIn 0.4s linear both;

      &[data-is-hide='true'] {
        animation: fadeOut 0.4s linear both;
      }
    `;
  }}
`;
