import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api';
import Search from './Search';
import CONSTANT from '~/constant';

import svgLogo from '~/assets/image/logo.svg?raw';

export default defineComponent({
  name: 'TheHeader',
  setup() {
    let ticking = false;
    let lastKnownScrollY = 0;

    onMounted(() => {
      const elHeader = document.querySelector('.js-header');

      if (!(elHeader instanceof HTMLElement)) {
        return;
      }

      const headerheight = elHeader.offsetHeight;

      document.addEventListener(
        'scroll',
        () => {
          handleScroll(elHeader, headerheight);
        },
        { passive: false },
      );
    });

    function handleScroll(elHeader: HTMLElement, headerheight: number) {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
          const currentScrollY = window.pageYOffset;

          // ヘッダーの高さを超えた場合
          if (currentScrollY >= headerheight) {
            if (currentScrollY <= lastKnownScrollY) {
              elHeader.classList.remove('is-unpin');
            } else {
              elHeader.classList.add('is-unpin');
            }
          } else {
            elHeader.classList.remove('is-unpin');
          }

          // 今回のスクロール位置を残す
          lastKnownScrollY = currentScrollY;
        });
      }

      ticking = true;
    }

    const showSearch = ref(false);

    function toggleModal() {
      document.body.classList.toggle('u-body-no-scroll', !showSearch.value);
      showSearch.value = !showSearch.value;
    }

    return {
      showSearch,
      toggleModal,
    };
  },
  render() {
    return (
      <header class="pj-header js-header">
        <div class="o-container pj-header-container">
          <nuxt-link title={CONSTANT.SITE_NAME} to="/" class="pj-header__logo" domPropsInnerHTML={svgLogo} />
          <button type="button" class="pj-header-search" aria-label="Search" onClick={this.toggleModal}>
            <div class="pj-header-search__icon">
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
        <Search isOpen={this.showSearch} onDone={this.toggleModal} />
      </header>
    );
  },
});
