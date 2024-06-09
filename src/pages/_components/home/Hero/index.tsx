import { memo } from 'react';

// import AvatarIcon from '@/assets/hiro0218.svg';
import { Stack } from '@/components/UI/Layout';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 100;
const ICON_SIZE_SHRINK = ICON_SIZE * 0.85;

export const Hero = memo(function Hero() {
  return (
    <Container align="center" space={2}>
      <Avatar>
        <img alt="hiro" height={ICON_SIZE} src="/hiro0218.svg" width={ICON_SIZE} />
      </Avatar>
      <Stack align="center" space={1}>
        <Heading>hiro</Heading>
        <P>Web Developer (Frontend) with experience in Backend, iOS App, and Windows App development.</P>
      </Stack>
    </Container>
  );
});

const Container = styled(Stack)`
  margin-inline: auto;

  ${isDesktop} {
    max-width: 50%;
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: ${ICON_SIZE}px;
  user-select: none;

  ${isMobile} {
    width: ${ICON_SIZE_SHRINK}px;
  }

  img {
    border-radius: var(--border-radius-full);

    ${isMobile} {
      width: ${ICON_SIZE_SHRINK}px;
      height: ${ICON_SIZE_SHRINK}px;
    }
  }
`;

const Heading = styled.h2`
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-xs);
`;

const P = styled.p`
  margin-top: var(--space-1);
  font-size: var(--font-size-md);
  color: var(--text-11);
  text-align: center;
`;
