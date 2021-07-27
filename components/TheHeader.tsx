import Link from 'next/link';
import React, { FC, useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';

import Search from '@/components/Search';
import { SITE } from '@/constant';
import Logo from '@/images/logo.svg';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const refHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    initUnpinHeader(refHeader.current);
  });

  return (
    <>
      <header ref={refHeader} className="pj-header">
        <div className="pj-header-container">
          <Link href="/">
            <a className="pj-header__logo">
              <img src="/hiro0218@100x100.webp" className="pj-header__avatar" alt="avatar" height="32" width="32" />
              <Logo width="5rem" />
              <span className="sr-only">{SITE.NAME}</span>
            </a>
          </Link>
          <button type="button" className="pj-header-search" aria-label="Search" onClick={openModal}>
            <div className="pj-header-search__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="1.25rem"
                height="1.25rem"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
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
