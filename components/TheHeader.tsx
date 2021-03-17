import Link from 'next/link';

import Logo from '@/images/logo.svg';

const TheHeader = () => {
  return (
    <header className="pj-header">
      <div className="pj-header-container">
        <Link href="/">
          <a className="pj-header__logo">
            <Logo />
          </a>
        </Link>
      </div>
    </header>
  );
};

export default TheHeader;
