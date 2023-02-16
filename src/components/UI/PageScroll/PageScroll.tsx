import { memo, useCallback } from 'react';

import { RxChevronDown, RxChevronUp } from '@/ui/icons';
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
      <Button type="button" aria-label="ページの最上部へスクロールする" onClick={onScrollTop}>
        <RxChevronUp size={24} />
      </Button>
      <Button type="button" aria-label="ページの最下部へスクロールする" onClick={onScrollBottom}>
        <RxChevronDown size={24} />
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
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-4);
  transition: background-color 0.2s ease;
  appearance: none;

  &:hover {
    background-color: var(--component-backgrounds-3A);
  }

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--borders-7);
  }
`;
