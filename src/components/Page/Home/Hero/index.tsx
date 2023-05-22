import { memo } from 'react';

import AvatarIcon from '@/assets/hiro0218.svg';
import { Title } from '@/components/UI/Title';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 100;

export const Hero = memo(function Hero() {
  return (
    <Container>
      <Avatar>
        <AvatarIcon height="100" width="100" />
      </Avatar>
      <Title
        heading="Hi, I'm hiro."
        headingTagName="h2"
        paragraph="Web Developer (Frontend) with experience in Backend, iOS App, and Windows App development."
      />
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
    width: ${ICON_SIZE * 0.85}px;
  }

  svg {
    border-radius: var(--border-radius-full);

    ${isMobile} {
      width: ${ICON_SIZE * 0.85}px;
      height: ${ICON_SIZE * 0.85}px;
    }
  }
`;
