import Link from 'next/link';

const TheFooter = () => {
  return (
    <footer className="pj-footer">
      <div className="pj-footer-container">
        <div className="pj-footer-menu">
          <ul className="pj-footer-menu__list">
            <li className="pj-footer-menu__item">
              <Link href="/" prefetch={false}>
                <a className="pj-footer__link">home</a>
              </Link>
            </li>
            <li className="pj-footer-menu__item">
              <Link href="/about" prefetch={false}>
                <a className="pj-footer__link">about</a>
              </Link>
            </li>
            <li className="pj-footer-menu__item">
              <Link href="/archive" prefetch={false}>
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
