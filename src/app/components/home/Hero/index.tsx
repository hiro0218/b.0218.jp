// import AvatarIcon from '@/assets/hiro0218.svg';
import { Stack } from '@/components/UI/Layout';
import { css, styled } from '@/ui/styled/static';
import Link from 'next/link';
import type { CSSProperties } from 'react';

const ICON_SIZE = 100;
const ICON_SIZE_SHRINK = ICON_SIZE * 0.85;

export const Hero = function Hero() {
  const intro = `I'm a web software developer from Japan. I spent 5 years in back-end development, 2 years on iOS and Windows applications, and started my front-end engineering career in 2017.`;

  return (
    <Stack className={ContainerStyle} align="start" direction="horizontal">
      <Avatar
        style={
          {
            '--hero-size': `${ICON_SIZE}px`,
            '--hero-size-shrink': `${ICON_SIZE_SHRINK}px`,
          } as CSSProperties
        }
      >
        <img alt="hiro (black cat icon)" height={ICON_SIZE} src="/hiro0218.svg" width={ICON_SIZE} />
      </Avatar>
      <Stack>
        <Heading>
          Hi, I'm <Link href="/about">hiro</Link>
        </Heading>
        <p>{intro}</p>
      </Stack>
    </Stack>
  );
};

const ContainerStyle = css`
  margin-inline: auto;
  font-size: var(--font-size-md);
  color: var(--color-gray-11);

  @media (--isDesktop) {
    max-width: 85%;
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: var(--hero-size);
  user-select: none;

  @media (--isMobile) {
    width: var(--hero-size-shrink);
  }

  img {
    aspect-ratio: 1/1;
    border-radius: var(--border-radius-full);
  }
`;

const Heading = styled.h2`
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bolder);
  line-height: var(--line-height-sm);
  letter-spacing: 0.04em;

  a {
    text-decoration-line: underline;
    text-decoration-thickness: 4px;
    text-decoration-color: var(--color-gray-8);
    text-underline-offset: 2%;

    &:hover {
      text-decoration-color: var(--color-gray-9);
    }
  }
`;
