import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import ReactModal from 'react-modal';

import { Logo } from '@/components/Logo';
import Search from '@/components/Search';

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
      <header ref={refHeader} className="pj-header">
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
