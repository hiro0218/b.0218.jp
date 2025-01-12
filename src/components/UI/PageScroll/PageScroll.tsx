import { ArrowUpIcon, ICON_SIZE_LG, ICON_SIZE_MD } from '@/ui/icons';
import { isMobile } from '@/ui/lib/mediaQuery';
import { css, styled } from '@/ui/styled/dynamic';

/**
 * Why do you specify # for href?
 * @see https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment-identifier
 */
export const PageScroll = () => {
  return (
    <Container data-floating>
      <Button aria-label="ページの最上部へスクロールする" href="#">
        <ArrowUpIcon />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  right: var(--space-2);
  bottom: var(--space-3);
  z-index: var(--zIndex-base);
  aspect-ratio: 1/1;
  isolation: isolate;
`;

const Button = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  color: var(--color-gray-12);
  background-color: var(--color-gray-3A);
  border-radius: var(--border-radius-full);
  transition: background-color 0.2s ease;

  svg {
    flex: 1 1;
    fill: currentColor;

    ${() => {
      return css`
        --desktop-size: ${ICON_SIZE_MD * 0.5}px;
        --mobile-size: ${ICON_SIZE_LG * 0.5}px;

        width: var(--desktop-size);
        height: var(--desktop-size);

        ${isMobile} {
          width: var(--mobile-size);
          height: var(--mobile-size);
        }
      `;
    }}
  }

  &:hover {
    background-color: var(--color-gray-4A);

    svg {
      animation: floatingFade 0.4s linear 0s;
    }
  }

  &:active {
    background-color: var(--color-gray-5A);
    border-color: var(--color-gray-7);
  }
`;
