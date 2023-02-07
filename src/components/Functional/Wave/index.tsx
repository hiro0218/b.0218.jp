import { memo } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export const WaveTop = memo(function WaveTop() {
  return (
    <Container aria-hidden="true">
      <svg viewBox="0 0 500 80" preserveAspectRatio="none">
        <path d="M0.00,49.99 C149.99,150.00 300.75,-49.99 500.00,49.99 L500.00,0.00 L0.00,0.00 Z"></path>
      </svg>
    </Container>
  );
});

export const WaveBottom = memo(function WaveBottom() {
  return (
    <Container aria-hidden="true">
      <svg viewBox="0 0 500 80" preserveAspectRatio="none">
        <path d="M0.00,49.99 C149.99,150.00 349.81,-49.99 500.00,49.99 L500.00,150.00 L0.00,150.00 Z"></path>
      </svg>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  overflow: hidden;
  pointer-events: none;

  svg {
    position: relative;
    z-index: -1;
    left: 50%;
    width: 100%;
    height: fit-content;
    margin: auto;
    transform: translateX(-50%);
    stroke: none;
    fill: var(--component-backgrounds-3);

    ${isMobile} {
      flex: 1 0 0;
      margin: 0;
    }
  }
`;
