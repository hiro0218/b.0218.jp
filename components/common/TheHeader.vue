<template>
  <header class="pj-header js-header">
    <div class="o-container pj-header__container">
      <nuxt-link :title="siteName" to="/" class="pj-header__logo" v-html="svgLogo" />
      <a
        href="https://www.google.com/search?q=site:b.0218.jp"
        target="_blank"
        title="site:b.0218.jp - Google 検索"
        class="c-search"
      >
        <font-awesome-icon icon="search" class="c-search__icon" />
      </a>
    </div>
  </header>
</template>

<script>
import svgLogo from '~/assets/image/logo.svg?raw';

export default {
  name: 'TheHeader',
  data() {
    return {
      svgLogo,
      eleHeader: null,
      classes: {
        unpinned: 'is-unpin',
      },
      lastKnownScrollY: 0,
      ticking: false,
    };
  },
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
  mounted: function () {
    this.eleHeader = document.querySelector('.js-header');
    document.addEventListener('scroll', this.handleScroll, !document.documentMode ? { passive: false } : false);
  },
  methods: {
    onScroll() {
      this.ticking = false;
      const currentScrollY = window.pageYOffset;
      if (this.lastKnownScrollY === currentScrollY || currentScrollY < 0) return;

      if (currentScrollY < this.lastKnownScrollY) {
        this.eleHeader.classList.remove(this.classes.unpinned);
      } else {
        this.eleHeader.classList.add(this.classes.unpinned);
      }

      this.lastKnownScrollY = currentScrollY;
    },
    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(this.onScroll);
      }
      this.ticking = true;
    },
  },
};
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
