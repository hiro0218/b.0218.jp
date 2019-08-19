<template>
  <header class="header-navigation">
    <div class="o-container header-container">
      <nuxt-link :title="siteName" to="/" class="logo">
        <svgLogo />
      </nuxt-link>
      <SearchInput />
    </div>
  </header>
</template>

<script>
import SearchInput from '~/components/SearchInput.vue';
import svgLogo from '~/assets/image/logo.svg?inline';

export default {
  name: 'TheHeader',
  components: {
    SearchInput,
    svgLogo,
  },
  data() {
    return {
      eleHeader: null,
      classes: {
        unpinned: 'unpin',
      },
      lastKnownScrollY: 0,
      ticking: false,
    };
  },
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
  mounted: function() {
    this.eleHeader = document.querySelector('.header-navigation');
    document.addEventListener('scroll', this.handleScroll, !document.documentMode ? { passive: false } : false);
  },
  methods: {
    onScroll() {
      this.ticking = false;
      let currentScrollY = window.pageYOffset;
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

<style lang="scss" scoped>
.header-navigation {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  height: $header-height;
  transition: transform 0.25s ease;
  border-bottom: 1px solid map-get($light-color, 1);
  background: #fff;
  will-change: transform;

  &.unpin {
    transform: translateY(-$header-height);
    box-shadow: none;
  }
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
a {
  display: flex;
  align-items: center;
  height: 100%;
  color: $base-color;
  &:hover {
    opacity: 0.6;
  }
  svg {
    width: 5rem;
    height: 100%;
    transition: width 0.2s;
    fill: $base-color;
    @include mobile {
      width: 4rem;
    }
  }
}
</style>
