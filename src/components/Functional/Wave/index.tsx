import { memo } from 'react';

import WaveBottomSvg from '@/assets/waveBottom.svg';
import WaveTopSvg from '@/assets/waveTop.svg';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export const WaveTop = memo(function WaveTop() {
  return (
    <Container aria-hidden="true">
      <WaveTopSvg />
    </Container>
  );
});

export const WaveBottom = memo(function WaveBottom() {
  return (
    <Container aria-hidden="true">
      <WaveBottomSvg />
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
    width: 100vw;
    height: max-content;
    pointer-events: none;
    fill: var(--component-backgrounds-3);
    stroke: none;

    ${isMobile} {
      flex: 1 0 0;
      margin: 0;
    }
  }
`;
