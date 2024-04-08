import { memo } from 'react';

// import AvatarIcon from '@/assets/hiro0218.svg';
import { Stack } from '@/components/UI/Layout';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 100;
const ICON_SIZE_SHRINK = ICON_SIZE * 0.85;

export const Hero = memo(function Hero() {
  return (
    <Stack direction="horizontal" space={2}>
      <Avatar>
        <img alt="hiro" height={ICON_SIZE} src="/hiro0218.svg" width={ICON_SIZE} />
      </Avatar>
      <header>
        <Heading>
          Hi, I&rsquo;m <strong>hiro</strong>.
        </Heading>
        <P>Web Developer (Frontend) with experience in Backend, iOS App, and Windows App development.</P>
      </header>
    </Stack>
  );
});

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
  font-weight: var(--font-weight-bolder);
  line-height: var(--line-height-sm);
`;

const P = styled.p`
  margin-top: var(--space-1);
  font-size: var(--font-size-md);
  color: var(--text-11);
`;
