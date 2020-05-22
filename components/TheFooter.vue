<template>
  <footer class="pj-footer">
    <div class="o-container">
      <button aria-label="scrollButton" class="pj-footer__scroll-button" @click="scrollTop">
        <font-awesome-icon icon="arrow-up" />
      </button>
      <nav class="pj-footer-menu">
        <ul class="u-list-unstyled pj-footer-menu__list">
          <li class="pj-footer-menu__item">
            <nuxt-link to="/about" class="pj-footer__link">
              about
            </nuxt-link>
          </li>
          <li class="pj-footer-menu__item">
            <nuxt-link to="/archive" class="pj-footer__link">
              archive
            </nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="pj-footer-copyright">
        <small class="pj-footer-copyright__text">
          ©
          <nuxt-link to="/" class="pj-footer__link">{{ siteName }}</nuxt-link>
        </small>
      </div>
    </div>
  </footer>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'TheFooter',
  setup() {
    const siteName = computed(() => process.env.SITE_NAME);

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
});
</script>
