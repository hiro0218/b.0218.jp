import dynamic from 'next/dynamic';

import { floatingFade } from '@/ui/animation';
import { ArrowUpIcon, ICON_SIZE_SM } from '@/ui/icons';
import { isMobile } from '@/ui/lib/mediaQuery';
import { hoverLinkStyle } from '@/ui/mixin';
import { styled } from '@/ui/styled';

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);

export const PageScroll = () => {
  return (
    <Container>
      <Button href="#">
        <ArrowUpIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        <SrOnly text="ページの最上部へスクロールする" />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  right: var(--space-2);
  bottom: var(--space-2);
  z-index: 1;

  ${isMobile} {
    right: var(--space-1);
    bottom: var(--space-1);
  }
`;

const Button = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 56px;
  padding: var(--space-2);
  color: var(--text-11);
  background-color: #fff;
  border: 1px solid currentColor;
  border-radius: var(--border-radius-full);
  transition: background-color 0.2s ease;

  ${hoverLinkStyle}

  &:hover {
    svg {
      animation: ${floatingFade} 0.4s linear 0s;
    }
  }
`;
