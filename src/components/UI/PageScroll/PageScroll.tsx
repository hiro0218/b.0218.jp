'use client';

import { Tooltip } from '@/components/UI/Tooltip';
import { ArrowUpIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';
/**
 * Why do you specify # for href?
 * @see https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment-identifier
 */
export const PageScroll = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container data-floating>
      <Button onClick={scrollToTop}>
        <ArrowUpIcon />
        <Tooltip position="top" text="ページトップへ" />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  right: var(--spacing-3);
  bottom: var(--spacing-3);
  z-index: var(--z-index-base);
  aspect-ratio: 1/1;
  isolation: isolate;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  color: var(--colors-gray-12);
  cursor: pointer;
  background-color: var(--colors-gray-a-3);
  border: none;
  border-radius: var(--radii-full);
  transition:
    background-color 0.2s ease-out,
    transform 0.1s ease-out;

  svg {
    --desktop-size: calc(var(--sizes-icon-md) * 0.5);
    --mobile-size: calc(var(--sizes-icon-lg) * 0.5);

    flex: 1 1;
    width: var(--desktop-size);
    height: var(--desktop-size);
    fill: currentColor;

    @media (--isMobile) {
      width: var(--mobile-size);
      height: var(--mobile-size);
    }
  }

  &:hover {
    background-color: var(--colors-gray-a-4);

    svg {
      animation: floatingFade 0.4s linear 0s;
    }
  }

  &:active {
    background-color: var(--colors-gray-a-5);
    border-color: var(--colors-gray-7);
    transform: scale(0.97);
  }
`;
