import { memo } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  position: 'top' | 'bottom';
};

const Wave = memo(function Wave({ position }: Props) {
  return (
    <Container aria-hidden="true" position={position}>
      <img alt="" decoding="async" height="192" src="/waveAnimation.svg" width="1920" />
    </Container>
  );
});

export const WaveTop = memo(function WaveTop() {
  return <Wave position="top" />;
});

export const WaveBottom = memo(function WaveBottom() {
  return <Wave position="bottom" />;
});

const Container = styled.div<Props>`
  position: relative;
  top: 2px;
  z-index: -1;
  display: flex;
  overflow: hidden;
  pointer-events: none;
  user-select: none;

  img {
    z-index: -1;
    width: auto;
    ${({ position }) => position === 'bottom' && `transform: rotate(180deg);`}

    ${isMobile} {
      max-width: unset;
    }
  }
`;
