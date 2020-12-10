import { defineComponent } from '@nuxtjs/composition-api';
import CONSTANT from '~/constant';
// @ts-ignore
import svgLogo from '~/assets/image/logo.svg?raw';

export default defineComponent({
  name: 'TheFooter',
  setup() {
    return {};
  },
  render() {
    return (
      <footer class="pj-footer">
        <div class="o-container">
          <div class="pj-footer__logo">
            <router-link to="/" title={CONSTANT.SITE_NAME} domPropsInnerHTML={svgLogo} />
          </div>
          <nav class="pj-footer-menu">
            <ul class="u-list-unstyled pj-footer-menu__list">
              <li class="pj-footer-menu__item">
                <router-link to="/about" class="pj-footer__link">
                  about
                </router-link>
              </li>
              <li class="pj-footer-menu__item">
                <router-link to="/archive" class="pj-footer__link">
                  archive
                </router-link>
              </li>
              <li class="pj-footer-menu__item">
                <a href="/rss.xml" class="pj-footer__link" target="_blank">
                  feed
                </a>
              </li>
            </ul>
          </nav>

          <div class="pj-footer-copyright">
            <small class="pj-footer-copyright__text">©&nbsp;hiro</small>
          </div>
        </div>
      </footer>
    );
  },
});
