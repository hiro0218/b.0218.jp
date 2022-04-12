import styled from '@emotion/styled';
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef } from 'react';
import { HiSearch } from 'react-icons/hi';

import { Logo } from '@/components/Logo';
import { mobile } from '@/lib/mediaQuery';

const Search = dynamic(() => import('@/components/Search'));

const HEADER_UNPIN_CLASS_NAME = 'is-unpin';

const initUnpinHeader = (elHeader: HTMLElement) => {
  const headerHeight = elHeader.offsetHeight;
  let ticking = false;
  let lastKnownScrollY = 0;

  const handleScroll = (elHeader: HTMLElement, headerHeight: number) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
        const currentScrollY = window.pageYOffset;

        // ヘッダーの高さを超えた場合
        if (currentScrollY >= headerHeight) {
          if (currentScrollY <= lastKnownScrollY) {
            elHeader.classList.remove(HEADER_UNPIN_CLASS_NAME);
          } else {
            elHeader.classList.add(HEADER_UNPIN_CLASS_NAME);
          }
        } else {
          elHeader.classList.remove(HEADER_UNPIN_CLASS_NAME);
        }

        // 今回のスクロール位置を残す
        lastKnownScrollY = currentScrollY;
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

  return (
    <>
      <HeaderRoot ref={refHeader}>
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
      </HeaderRoot>

      <Dialog ref={refDialog} onClick={closeDialog}>
        <div onClick={stopPropagation}>
          <Search />
        </div>
      </Dialog>
    </>
  );
};

const HeaderRoot = styled.header`
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

  &:hover,
  &:focus {
    background-color: var(--component-backgrounds-4);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--text-12);
  }
`;

const Dialog = styled.dialog`
  top: 10vh;
  padding: 0;
  border: none;
`
