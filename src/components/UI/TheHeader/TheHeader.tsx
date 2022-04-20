import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { Logo } from '@/components/UI/Logo';
import { SearchButton, SearchDialog } from '@/components/UI/Search';
import { useModal } from '@/components/UI/Search/useDialog';
import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

const HEADER_UNPIN_CLASS_NAME = 'is-unpin';

const initUnpinHeader = (elHeader: HTMLElement) => {
  const headerHeight = elHeader.offsetHeight;
  let ticking = false;
  let lastScrollY = 0;

  const handleScroll = (elHeader: HTMLElement, headerHeight: number) => {
    const currentScrollY = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;

        // ヘッダーの高さを超えた場合
        if (currentScrollY >= headerHeight) {
          elHeader.classList.toggle(HEADER_UNPIN_CLASS_NAME, (currentScrollY <= lastScrollY));
        } else {
          elHeader.classList.remove(HEADER_UNPIN_CLASS_NAME);
        }

        // 今回のスクロール位置を残す
        lastScrollY = currentScrollY;
      });
    }

    ticking = true;
  };

  document.addEventListener(
    'scroll',
    () => {
      handleScroll(elHeader, headerHeight);
    },
    { passive: true },
  );
};

export const TheHeader = () => {
  const { ref, openDialog, closeDialog } = useModal();
  const { asPath } = useRouter();
  const refHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    initUnpinHeader(refHeader.current);
  }, []);

  useEffect(() => {
    closeDialog();
  }, [asPath, closeDialog]);

  return (
    <>
      <Underline>
        <Header ref={refHeader}>
          <Container>
            <Link href="/" prefetch={false} passHref>
              <LogoAnchor>
                <Logo width="80" height="25" />
              </LogoAnchor>
            </Link>
            <SearchButton openDialog={openDialog} />
          </Container>
        </Header>
      </Underline>

      <SearchDialog ref={ref} closeDialog={closeDialog} />
    </>
  );
};

const Underline = styled.div`
  height: var(--header-height);
`;

const Header = styled.header`
  position: fixed;
  z-index: var(--zIndex-header);
  top: 0;
  right: 0;
  left: 0;
  height: var(--header-height);
  margin: 0 auto;
  transition: transform 0.25s ease;
  pointer-events: none;
  will-change: transform;

  &.${HEADER_UNPIN_CLASS_NAME} {
    transform: translateY(calc(var(--header-height) * -1));
    box-shadow: none;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-width);
  height: 100%;
  margin: 0 auto;
  transition: padding 0.1s ease-in-out;

  ${mobile} {
    padding: 0 5vw;
  }
`;

const LogoAnchor = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
`;

