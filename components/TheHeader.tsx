import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import ReactModal from 'react-modal';

import { Logo } from '@/components/Logo';
import Search from '@/components/Search';
import { mobile } from '@/lib/mediaQuery';

ReactModal.setAppElement('#__next');
const customStyles = {
  overlay: {
    zIndex: 'var(--zIndex-search-overlay)' as string,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    position: 'static',
    padding: 0,
    border: 'none',
    borderRadius: 'none',
    background: 'none',
  },
} as ReactModal.Styles;

const initUnpinHeader = (elHeader: HTMLElement) => {
  const headerHeight = elHeader.offsetHeight;
  const headerUnpinClassName = 'is-unpin';
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
            elHeader.classList.remove(headerUnpinClassName);
          } else {
            elHeader.classList.add(headerUnpinClassName);
          }
        } else {
          elHeader.classList.remove(headerUnpinClassName);
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

const TheHeader: FC = () => {
  const { asPath } = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const refHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    initUnpinHeader(refHeader.current);
  }, []);

  useEffect(() => {
    closeModal();
  }, [asPath, closeModal]);

  return (
    <>
      <header ref={refHeader} css={cssHeader} className="pj-header">
        <div className="pj-header-container">
          <Link href="/" prefetch={false}>
            <a className="pj-header__logo">
              <Logo width="80" height="25" />
            </a>
          </Link>
          <button type="button" className="pj-header-search" aria-label="Search" onClick={openModal}>
            <div className="pj-header-search__icon">
              <HiSearch />
            </div>
          </button>
        </div>
      </header>

      <ReactModal
        isOpen={modalIsOpen}
        preventScroll={true}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
      >
        <Search />
      </ReactModal>
    </>
  );
};

export default TheHeader;

const cssHeader = css`
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

  &.is-unpin {
    transform: translateY(calc(var(--header-height) * -1));
    box-shadow: none;
  }

  .pj-header-container {
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
  }

  .pj-header__logo {
    display: flex;
    align-items: center;
    height: 100%;
    color: var(--color-text);
    pointer-events: auto;
  }

  .pj-header-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    transition: background 0.2s ease;
    border: none;
    border-radius: 100%;
    background: none;
    cursor: pointer;
    pointer-events: auto;

    &:hover,
    &:focus {
      background: var(--bg-color--lighter);
    }
  }

  .pj-header-search__icon {
    display: flex;

    & svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-text--light);
    }
  }
`;
