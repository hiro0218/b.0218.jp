import { memo, useCallback } from 'react';

import { ICON_SIZE_SM, RxChevronDown, RxChevronUp } from '@/ui/icons';
import { hoverLinkStyle } from '@/ui/mixin';
import { styled } from '@/ui/styled';

export const PageScroll = memo(function PageScroll() {
  const onScrollTop = useCallback(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const onScrollBottom = useCallback(() => {
    const documentElement = document.documentElement;
    const positionBottom = documentElement.scrollHeight - documentElement.clientHeight;

    window.scroll({
      top: positionBottom,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Container>
      <Button aria-label="ページの最上部へスクロールする" onClick={onScrollTop} type="button">
        <RxChevronUp size={ICON_SIZE_SM} />
      </Button>
      <Button aria-label="ページの最下部へスクロールする" onClick={onScrollBottom} type="button">
        <RxChevronDown size={ICON_SIZE_SM} />
      </Button>
    </Container>
  );
});

const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  appearance: none;
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-4);
  transition: background-color 0.2s ease;

  ${hoverLinkStyle}
`;
