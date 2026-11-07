'use client';

import { CaretLineUpIcon } from '@phosphor-icons/react';
import { Tooltip } from '@/components/UI/Tooltip';
import { MAIN_CONTENT_ID } from '@/constants';
import { styled } from '@/ui/styled';

// Container は scroll-driven animation で scrollY < 120px の間 visibility: hidden になる。
// クリック元のボタン自身にフォーカスを残そうとすると、その非表示化に巻き込まれてブラウザが
// フォーカスを document.body へ落としてしまう。skip-link と同じ着地点（メインコンテンツ先頭）へ
// 明示的に移し、キーボード操作後の位置を見失わせない。
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
};

export const PageScroll = () => (
  <Container>
    <Tooltip position="top" text="ページトップへ">
      <Button aria-label="ページトップへ" onClick={scrollToTop}>
        <CaretLineUpIcon />
      </Button>
    </Tooltip>
  </Container>
);

const Container = styled.div`
  position: fixed;
  right: var(--spacing-400);
  bottom: var(--spacing-400);
  z-index: var(--z-index-base);
  aspect-ratio: 1/1;
  isolation: isolate;

  @media (prefers-reduced-motion: no-preference) {
    animation: fadeOut linear reverse both;
    animation-duration: auto;
    /* stylelint-disable-next-line plugin/browser-compat */
    animation-timeline: scroll(root block);
    /* stylelint-disable-next-line plugin/browser-compat */
    animation-range: 120px 360px;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-300);
  color: var(--colors-gray-1000);
  cursor: pointer;
  background-color: var(--colors-gray-a-100);
  border: none;
  border-radius: var(--radii-full);
  transition:
    background-color var(--transition-slow),
    transform var(--transition-fast);

  svg {
    --desktop-size: calc(var(--sizes-icon-md) * 0.5);
    --mobile-size: calc(var(--sizes-icon-lg) * 0.5);

    flex: 1 1;
    width: var(--mobile-size);
    height: var(--mobile-size);
    color: inherit;

    @media (--isDesktop) {
      width: var(--desktop-size);
      height: var(--desktop-size);
    }
  }

  &:hover {
    background-color: var(--colors-gray-a-200);

    @media (prefers-reduced-motion: no-preference) {
      svg {
        animation: floatingFade var(--durations-slow) var(--easings-ease-out-expo) 0s;
      }
    }
  }

  &:active {
    background-color: var(--colors-gray-a-300);
    border-color: var(--colors-gray-700);
    transform: scale(0.96);
  }
`;
