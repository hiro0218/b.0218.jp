// import AvatarIcon from '@/assets/hiro0218.svg';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { css, styled } from '@/ui/styled';

const ICON_SIZE = 100;
const ICON_SIZE_SHRINK = ICON_SIZE * 0.85;

const avatarStyle = {
  '--hero-size': `${ICON_SIZE}px`,
  '--hero-size-shrink': `${ICON_SIZE_SHRINK}px`,
} as CSSProperties;

export const Hero = function Hero() {
  const intro = `I'm just following the path I believe in. The results will come later.`;

  return (
    <div className={ContainerStyle}>
      <Avatar style={avatarStyle}>
        <img alt="hiro (black cat icon)" height={ICON_SIZE} src="/hiro0218.svg" width={ICON_SIZE} />
      </Avatar>
      <Heading>
        Hi, I'm <Link href="/about">hiro</Link>.
      </Heading>
      <p className={paragraphStyle}>{intro}</p>
    </div>
  );
};

const ContainerStyle = css`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  gap: 0 var(--spacing-2);
  max-width: 85%;
  margin-inline: auto;
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-900);
`;

const Avatar = styled.div`
  flex-shrink: 0;
  grid-row: 1 / span 2;
  grid-column: 1 / 2;
  width: clamp(var(--hero-size-shrink), 15vw, var(--hero-size));
  user-select: none;

  img {
    aspect-ratio: 1/1;
    border-radius: var(--radii-full);
  }
`;

const Heading = styled.h2`
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  font-size: var(--font-sizes-h3);
  font-weight: var(--font-weights-bolder);
  letter-spacing: 0.04em;

  a {
    text-decoration-line: underline;
    text-decoration-thickness: 4px;
    text-decoration-color: var(--colors-gray-700);
    text-underline-offset: 2%;

    &:hover {
      text-decoration-color: var(--colors-gray-900);
    }
  }
`;

const paragraphStyle = css`
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  color: var(--colors-gray-600);
`;
