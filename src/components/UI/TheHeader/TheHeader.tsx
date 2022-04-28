import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/UI/Logo';
import { SearchButton, SearchDialog } from '@/components/UI/Search';
import { useModal } from '@/components/UI/Search/useDialog';
import { mobile } from '@/lib/mediaQuery';
import { css, styled } from '@/ui/styled';
import { theme } from '@/ui/themes';

const initUnpinHeader = (setIsHeaderShown: Dispatch<SetStateAction<boolean>>) => {
  const headerHeight = theme.components.header.height;
  let ticking = false;
  let lastScrollY = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;

        // ヘッダーの高さを超えた場合
        if (currentScrollY >= headerHeight) {
          setIsHeaderShown(currentScrollY <= lastScrollY);
        } else {
          setIsHeaderShown(true);
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
      handleScroll();
    },
    { passive: true },
  );
};

export const TheHeader = () => {
  const { ref, openDialog, closeDialog } = useModal();
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const { asPath } = useRouter();
  const refHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    initUnpinHeader(setIsHeaderShown);
  }, []);

  useEffect(() => {
    closeDialog();
  }, [asPath, closeDialog]);

  return (
    <>
      <Underline>
        <Header ref={refHeader} isFixed={isHeaderShown}>
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
  ${({ theme }) => {
    return css`height: ${theme.components.header.height}px;`
  }}
`;

const Header = styled.header<{ isFixed: boolean }>`
  position: fixed;
  z-index: var(--zIndex-header);
  top: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  transition: transform 0.25s ease;
  pointer-events: none;
  will-change: transform;

  ${({ theme }) => {
    return css`height: ${theme.components.header.height}px;`
  }}

  ${({ theme, isFixed }) => {
    return (
      !isFixed &&
      css`&& {
        transform: translateY(${theme.components.header.height * -1}px);
      }`
    )
  }}
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

