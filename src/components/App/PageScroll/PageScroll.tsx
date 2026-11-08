'use client';

import { CaretLineUpIcon } from '@phosphor-icons/react';
import { useHeaderVisibility, useIsScrolledPast } from '@/components/App/useHeaderVisibility';
import { Tooltip } from '@/components/UI/Tooltip';
import { MAIN_CONTENT_ID } from '@/constants';
import { getScrollBehavior } from '@/lib/browser/smoothScroll';
import { styled } from '@/ui/styled';

const SHOW_AFTER_SCROLL_PX = 120;

// Container は先頭付近と読み進めている間、visibility: hidden になる。
// クリック元のボタン自身にフォーカスを残そうとすると、その非表示化に巻き込まれてブラウザが
// フォーカスを document.body へ落としてしまう。skip-link と同じ着地点（メインコンテンツ先頭）へ
// 明示的に移し、キーボード操作後の位置を見失わせない。
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
};

// 下へ読み進めている間は出さない。本文やコードのコピーのボタンの上に重なるため。
// scroll-driven animation（animation-timeline）では出し入れしない。対応しないブラウザや、動きを減らす設定で
// animation ごと外れると、先頭から出てしまう。スクロールの方向も見られないため
export const PageScroll = () => {
  const isHeaderShown = useHeaderVisibility();
  const isScrolled = useIsScrolledPast(SHOW_AFTER_SCROLL_PX);

  return (
    <Container data-is-shown={isHeaderShown && isScrolled}>
      <Tooltip position="top" text="ページトップへ">
        <Button aria-label="ページトップへ" onClick={scrollToTop}>
          <CaretLineUpIcon />
        </Button>
      </Tooltip>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  right: var(--spacing-400);
  bottom: var(--spacing-400);
  z-index: var(--z-index-base);
  visibility: hidden;
  aspect-ratio: 1/1;
  isolation: isolate;
  opacity: 0;

  &[data-is-shown='true'] {
    visibility: visible;
    opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity var(--transition-slow),
      visibility var(--transition-slow);
  }
`;

// 円の大きさは、アイコン + padding ではなく押せる大きさ（44px）で決め、幅によらず 44px で固定する。
// padding で囲むと、アイコンの大きさ（デスクトップ 16px、モバイル 24px）に引きずられて、円が 48px・56px へ動くため
const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sizes-touch-target);
  height: var(--sizes-touch-target);
  padding: 0;
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
