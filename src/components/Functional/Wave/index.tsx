import { memo } from 'react';

import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  containerHeight?: number;
  svgFill?: string;
};

export const WaveBottom = memo(function WaveBottom({ containerHeight = 150, svgFill = '#fff' }: Props) {
  return (
    <Container position="bottom" aria-hidden="true" containerHeight={containerHeight} svgFill={svgFill}>
      <svg viewBox="0 0 500 150" preserveAspectRatio="xMaxYMax slice">
        <path d="M0.00,49.99 C149.99,150.00 349.81,-49.99 500.00,49.99 L500.00,150.00 L0.00,150.00 Z"></path>
      </svg>
    </Container>
  );
});

export const WaveTop = memo(function WaveTop({ containerHeight = 150, svgFill = '#fff' }: Props) {
  return (
    <Container position="top" aria-hidden="true" containerHeight={containerHeight} svgFill={svgFill}>
      <svg viewBox="0 0 500 150" preserveAspectRatio="xMaxYMax slice">
        <path d="M0.00,49.99 C149.99,150.00 300.75,-49.99 500.00,49.99 L500.00,0.00 L0.00,0.00 Z"></path>
      </svg>
    </Container>
  );
});

const Container = styled.div<Props & { position: 'top' | 'bottom' }>`
  overflow: hidden;
  display: flex;

  ${isDesktop} {
    margin-bottom: ${({ position }) => position === 'bottom' && -100}px;
  }

  svg {
    position: relative;
    z-index: -1;
    width: 100%;
    stroke: none;
    fill: ${({ svgFill }) => svgFill};

    ${isMobile} {
      left: 50%;
      flex: 1 0 0;
      margin: 0;
      transform: translateX(-50%);
    }
  }
`;
