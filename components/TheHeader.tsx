import Link from 'next/link';
import React, { useEffect } from 'react';

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
    { passive: false },
  );
};

const TheHeader = () => {
  useEffect(() => {
    initUnpinHeader();
  });

  return (
    <header className="pj-header js-header">
      <div className="l-container pj-header-container">
        <Link href="/">
          <a className="pj-header__logo">
            <Logo width="5rem" />
          </a>
        </Link>
      </div>
    </header>
  );
};

export default TheHeader;
