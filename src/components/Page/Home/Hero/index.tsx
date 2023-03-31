import { memo } from 'react';

import { Title } from '@/components/UI/Title';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 100;

export const Hero = memo(function Hero() {
  return (
    <Container>
      <Avatar>
        <img alt="" decoding="async" height={ICON_SIZE} src="/hiro0218@100x100.webp" width={ICON_SIZE} />
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

  ${isMobile} {
    width: ${ICON_SIZE / 1.5}px;
  }

  img {
    border: 5px solid var(--backgrounds-1);
    border-radius: var(--border-radius-full);
  }
`;
