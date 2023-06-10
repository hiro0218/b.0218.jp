import { memo } from 'react';

import WaveBottomSvg from '@/assets/waveBottom.svg';
import WaveTopSvg from '@/assets/waveTop.svg';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  svgHeight?: {
    desktop: number;
    mobile: number;
  };
};

const DEFAULT_SVG_HEIGHT = {
  desktop: 120,
  mobile: 80,
};

export const WaveTop = memo(function WaveTop({ svgHeight }: Props) {
  const svgHeightMerged = { ...DEFAULT_SVG_HEIGHT, ...svgHeight };

  return (
    <Container aria-hidden="true" svgHeight={svgHeightMerged}>
      <WaveTopSvg />
    </Container>
  );
});

export const WaveBottom = memo(function WaveBottom({ svgHeight }: Props) {
  const svgHeightMerged = { ...DEFAULT_SVG_HEIGHT, ...svgHeight };

  return (
    <Container aria-hidden="true" svgHeight={svgHeightMerged}>
      <WaveBottomSvg />
    </Container>
  );
});

const Container = styled.div<Props>`
  display: flex;
  overflow: hidden;
  pointer-events: none;

  svg {
    position: relative;
    z-index: -1;
    width: 100vw;
    height: ${({ svgHeight }) => `${svgHeight.desktop}px`};
    pointer-events: none;
    fill: var(--component-backgrounds-3);
    stroke: none;

    ${isMobile} {
      flex: 1 0 0;
      height: ${({ svgHeight }) => `${svgHeight.mobile}px`};
      margin: 0;
    }
  }
`;
