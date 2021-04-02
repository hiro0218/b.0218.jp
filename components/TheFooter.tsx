import Link from 'next/link';

const TheFooter = () => {
  return (
    <footer className="pj-footer">
      <div className="l-container pj-footer-container">
        <div className="pj-footer-menu">
          <ul className="pj-footer-menu__list">
            <li className="pj-footer-menu__item">
              <Link href="/">
                <a className="pj-footer__link">home</a>
              </Link>
            </li>
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
