<template>
  <header class="pj-header js-header">
    <div class="o-container pj-header__container">
      <nuxt-link :title="siteName" to="/" class="pj-header__logo" v-html="svgLogo" />
      <a
        href="https://www.google.com/search?q=site:b.0218.jp"
        target="_blank"
        rel="noopener"
        title="site:b.0218.jp - Google 検索"
        class="c-search"
      >
        <font-awesome-icon icon="search" class="c-search__icon" />
      </a>
    </div>
  </header>
</template>

<script type="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api';

import svgLogo from '~/assets/image/logo.svg?raw';

export default defineComponent({
  name: 'TheHeader',
  setup() {
    const siteName = computed(() => process.env.SITE_NAME);
    let ticking = false;
    let lastKnownScrollY = 0;

    onMounted(() => {
      const elHeader = document.querySelector('.js-header');
      const headerheight = elHeader.offsetHeight;

      document.addEventListener('scroll', () => {
        handleScroll(elHeader, headerheight);
      }, !document.documentMode ? { passive: false } : false);
    });

    function handleScroll(elHeader, headerheight) {
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

    return {
      svgLogo,
      siteName,
    };
  },
});
</script>

<style lang="scss">
.pj-header {
  position: fixed;
  z-index: $zIndex-header;
  top: 0;
  right: 0;
  left: 0;
  height: $header-height;
  transition: transform 0.25s ease;
  border-bottom: 1px solid $border-color;
  background: #fff;
  will-change: transform;

  &.is-unpin {
    transform: translateY(-$header-height);
    box-shadow: none;
  }
}

.pj-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.pj-header__logo {
  display: flex;
  align-items: center;
  height: 100%;
  color: $color-text;

  &:hover {
    opacity: 0.6;
  }

  svg {
    width: 5rem;
    height: 100%;
    transition: width 0.2s;
    fill: $color-text;
  }
}

.c-search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 100%;
}

.c-search__icon {
  width: 1rem;
  height: 1rem;
  color: $color-text--light;
}
</style>
