import { keyframes } from '@emotion/react'
import styled from '@emotion/styled';
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef } from 'react';
import { HiSearch } from 'react-icons/hi';

import { Logo } from '@/components/UI/Logo';
import { mobile } from '@/lib/mediaQuery';
import { showHoverBackground } from '@/ui/mixin';

const Search = dynamic(() => import('@/components/Search'));

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

export const TheHeader: FC = () => {
  const refDialog = useRef<HTMLDialogElement>(null);
  const refStyleOverflow = useRef<CSSStyleDeclaration["overflow"]>(
    typeof window !== 'undefined' ? window.getComputedStyle(document.body).overflow : ''
  );
  const { asPath } = useRouter();

  const openDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    refDialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  const closeDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    refDialog.current?.close();
    document.body.style.overflow = refStyleOverflow.current;
  }, []);

  const stopPropagation = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  const refHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    initUnpinHeader(refHeader.current);
  }, []);

  useEffect(() => {
    closeDialog();
  }, [asPath, closeDialog]);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      closeDialog();
    }
  }, [closeDialog]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction);

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction]);

  return (
    <>
      <Underline>
        <Header ref={refHeader}>
          <HeaderContainer>
            <Link href="/" prefetch={false} passHref>
              <HeaderLogoAnchor>
                <Logo width="80" height="25" />
              </HeaderLogoAnchor>
            </Link>
            <HeaderSearchButton type="button" aria-label="Search" onClick={openDialog}>
              <HiSearch />
            </HeaderSearchButton>
          </HeaderContainer>
        </Header>
      </Underline>

      <Dialog ref={refDialog} onClick={closeDialog}>
        <div onClick={stopPropagation}>
          <Search />
        </div>
      </Dialog>
    </>
  );
};

const slideIn = keyframes`
  0% {
    transform: translateY(400px);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }
  80% {
    transform: translateY(10px);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0px);
    animation-timing-function: ease-in;
  }
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

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

const HeaderContainer = styled.div`
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

const HeaderLogoAnchor = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
`;

const HeaderSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  transition: background-color 0.2s ease;
  border: none;
  border-radius: 100%;
  background: none;
  cursor: pointer;
  pointer-events: auto;

  ${showHoverBackground}

  &::after {
    border-radius: 100%;
  }

  &:focus {
    background-color: var(--component-backgrounds-5);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-12);
  }
`;

const Dialog = styled.dialog`
  &[open] {
    padding: 0;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
    border: none;
  }
`
