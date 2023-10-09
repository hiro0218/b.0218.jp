import { ChevronDownIcon, ChevronUpIcon, ICON_SIZE_SM } from '@/ui/icons';
import { hoverLinkStyle } from '@/ui/mixin';
import { styled } from '@/ui/styled';

export const PageScroll = () => {
  const onScrollTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const onScrollBottom = () => {
    window.scroll({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Container>
      <Button aria-label="ページの最上部へスクロールする" onClick={onScrollTop} type="button">
        <ChevronUpIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      </Button>
      <Button aria-label="ページの最下部へスクロールする" onClick={onScrollBottom} type="button">
        <ChevronDownIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      </Button>
    </Container>
  );
};

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

  ${hoverLinkStyle}
`;
