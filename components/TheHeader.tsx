import Link from 'next/link';

import Logo from '@/images/logo.svg';

const TheHeader = () => {
  return (
    <header className="pj-header">
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
