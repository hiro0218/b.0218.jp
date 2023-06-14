import { memo } from 'react';

import AvatarIcon from '@/assets/hiro0218.svg';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 100;
const ICON_SIZE_SHRINK = ICON_SIZE * 0.85;

export const Hero = memo(function Hero() {
  return (
    <Container>
      <Avatar>
        <AvatarIcon height="100" width="100" />
      </Avatar>
      <header>
        <Heading>Hi, I&rsquo;m hiro.</Heading>
        <P>Web Developer (Frontend) with experience in Backend, iOS App, and Windows App development.</P>
      </header>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: ${ICON_SIZE}px;
  user-select: none;

  ${isMobile} {
    width: ${ICON_SIZE_SHRINK}px;
  }

  svg {
    border-radius: var(--border-radius-full);

    ${isMobile} {
      width: ${ICON_SIZE_SHRINK}px;
      height: ${ICON_SIZE_SHRINK}px;
    }
  }
`;

const Heading = styled.h2`
  font-weight: var(--font-weight-bolder);
`;

const P = styled.p`
  margin-top: var(--space-1);
  font-size: var(--font-size-md);
  color: var(--text-11);
`;
