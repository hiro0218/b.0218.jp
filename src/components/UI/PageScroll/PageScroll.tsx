import { memo, useCallback } from 'react';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';

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
        <RxCaretUp size={32} />
      </Button>
      <Button type="button" aria-label="ページの最下部へスクロールする" onClick={onScrollBottom}>
        <RxCaretDown size={32} />
      </Button>
    </Container>
  );
});

const Container = styled.div`
  position: fixed;
  z-index: 1;
  right: 0;
  bottom: 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  transition: background-color 0.2s ease;
  border: none;
  border-radius: 0.25rem;
  background-color: transparent;
  appearance: none;

  &:hover {
    background-color: var(--component-backgrounds-3A);
  }

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--borders-7);
  }
`;
