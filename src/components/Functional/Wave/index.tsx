import { memo } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  fill?: string;
};

const _WaveUp = ({ fill = '#fff' }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path
        style={{ fill: fill }}
        d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,192C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      ></path>
    </svg>
  );
};

export const WaveUp = memo(_WaveUp);

const _WaveDown = ({ fill = '#fff' }: Props) => {
  return (
    <SvgAdjustContainer>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 140" preserveAspectRatio="none">
        <path
          style={{ fill: fill }}
          d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,101.3C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </SvgAdjustContainer>
  );
};

const SvgAdjustContainer = styled.div`
  overflow: hidden;

  svg {
    position: relative;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);

    ${isMobile} {
      height: 150px;
    }
  }
`;

export const WaveDown = memo(_WaveDown);
