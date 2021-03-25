import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Search from '@/components/Search';
import Logo from '@/images/logo.svg';

const initUnpinHeader = () => {
  const elHeader = document.querySelector<HTMLDivElement>('.js-header');
  const headerHeight = elHeader.offsetHeight;
  const headerUnpinClassName = 'is-unpin';
  let ticking = false;
  let lastKnownScrollY = 0;

  const handleScroll = (elHeader: HTMLDivElement, headerHeight: number) => {
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

const TheHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    document.body.classList.toggle('is-no-scroll', !isOpen);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    initUnpinHeader();
  });

  return (
    <>
      <header className="pj-header js-header">
        <div className="l-container pj-header-container">
          <Link href="/">
            <a className="pj-header__logo">
              <Logo width="5rem" />
            </a>
          </Link>
          <button type="button" className="pj-header-search" aria-label="Search" onClick={toggleModal}>
            <div className="pj-header-search__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
      {isOpen && <Search isOpen={isOpen} toggleHandler={toggleModal} />}
    </>
  );
};

export default TheHeader;
