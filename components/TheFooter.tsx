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
          <button aria-label="scrollButton" class="pj-footer__scroll-button" onClick={() => this.scrollTop()}>
            <div domPropsInnerHTML={this.$icon['arrow-up']} />
          </button>
          <nav class="pj-footer-menu">
            <ul class="u-list-unstyled pj-footer-menu__list">
              <li class="pj-footer-menu__item">
                <a href="/about" class="pj-footer__link">
                  about
                </a>
              </li>
              <li class="pj-footer-menu__item">
                <a href="/archive" class="pj-footer__link">
                  archive
                </a>
              </li>
            </ul>
          </nav>

          <div class="pj-footer-copyright">
            <small class="pj-footer-copyright__text">
              ©
              <a href="/" class="pj-footer__link">
                {this.siteName}
              </a>
            </small>
          </div>
        </div>
      </footer>
    );
  },
});
