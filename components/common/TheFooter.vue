<template>
  <footer class="pj-footer">
    <div class="o-container">
      <button aria-label="scrollButton" class="pj-footer__scroll-button" @click="scrollTop">
        <font-awesome-icon icon="arrow-up" />
      </button>
      <nav class="pj-footer__menu">
        <ul class="u-list-unstyled pj-footer__menu-list">
          <li class="pj-footer__menu-item">
            <nuxt-link to="/about" class="pj-footer__link">
              about
            </nuxt-link>
          </li>
          <li class="pj-footer__menu-item">
            <nuxt-link to="/archive" class="pj-footer__link">
              archive
            </nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="pj-footer__copyright">
        <small class="pj-footer__copyright__text">
          ©
          <nuxt-link to="/" class="pj-footer__link">{{ siteName }}</nuxt-link>
        </small>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
  methods: {
    scrollTop: function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="scss">
.pj-footer {
  padding: 3rem 0;
  background: $color-text;
  color: $bg-color;
  font-size: $font-size-sm;
  text-align: center;
}

.pj-footer__link {
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
}

// scroll top button
.pj-footer__scroll-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  appearance: none;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

// menu
.pj-footer__menu {
  margin-bottom: 1rem;
}

.pj-footer__menu-list {
  display: inline-flex;
}

.pj-footer__menu-item {
  & + & {
    margin-left: map-get($size, sm) * 1rem;
  }
}

// copyright
.pj-footer__copyright {
  &__text {
    font-size: 1em;
  }
}
</style>
