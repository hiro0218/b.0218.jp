import { defineComponent, computed } from '@vue/composition-api';
import CONSTANT from '~/constant';

export default defineComponent({
  name: 'TheFooter',
  setup() {
    const siteName = computed(() => CONSTANT.SITE_NAME);

    function scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    return {
      siteName,
      scrollTop,
    };
  },
  render() {
    return (
      <footer class="pj-footer">
        <div class="o-container">
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
            </ul>
          </nav>

          <div class="pj-footer-copyright">
            <small class="pj-footer-copyright__text">
              ©&nbsp;
              <router-link to="/" class="pj-footer__link">
                {this.siteName}
              </router-link>
            </small>
          </div>
        </div>
      </footer>
    );
  },
});
