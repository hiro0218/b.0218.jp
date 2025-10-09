import { memo, type ReactNode } from 'react';

import useIsMounted from '@/hooks/useIsMounted';
import { css, styled } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo(function HeaderLayout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderScrollHandler();
  const isMountedValue = isMounted();

  return (
    <div className={underlineStyle}>
      <Header data-floating data-is-hide={!isHeaderShown} data-is-mounted={isMountedValue}>
        {children}
      </Header>
    </div>
  );
});

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
  will-change: opacity;

  &[data-is-mounted='true'] {
    animation: fadeIn 0.4s linear both;

    &[data-is-hide='true'] {
      animation: fadeOut 0.4s linear both;
    }
  }
`;
