import Link from 'next/link';

import Logo from '@/images/logo.svg';

const TheFooter = () => {
  return (
    <footer className="pj-footer">
      <div className="l-container">
        <div className="pj-footer__logo">
          <Logo />
        </div>
        <div className="pj-footer-menu">
          <ul className="u-list-unstyled pj-footer-menu__list">
            <li className="pj-footer-menu__item">
              <Link href="/about">
                <a className="pj-footer__link">about</a>
              </Link>
            </li>
            <li className="pj-footer-menu__item">
              <Link href="/archive">
                <a className="pj-footer__link">archive</a>
              </Link>
            </li>
            <li className="pj-footer-menu__item">
              <a href="/rss.xml" className="pj-footer__link" target="_blank">
                feed
              </a>
            </li>
          </ul>
        </div>

        <div className="pj-footer-copyright">
          <small className="pj-footer-copyright__text">©&nbsp;hiro</small>
        </div>
      </div>
    </footer>
  );
};

export default TheFooter;
