<template>
  <footer>
    <div class="o-container">
      <div class="button-scrollTop" @click="scrollTop">
        <svgUpward />
      </div>
      <nav class="menu">
        <ul class="u-list-unstyled menu-list">
          <li class="menu-item">
            <nuxt-link to="/about">
              about
            </nuxt-link>
          </li>
          <li class="menu-item">
            <nuxt-link to="/archive">
              archive
            </nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="copyright">
        <small>
          ©
          <nuxt-link to="/">{{ siteName }}</nuxt-link>
        </small>
      </div>
    </div>
  </footer>
</template>

<script>
import svgUpward from '~/assets/image/arrow_upward.svg?inline';

export default {
  name: 'TheFooter',
  components: {
    svgUpward,
  },
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
  methods: {
    scrollTop: function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
footer {
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: $base-color;
  color: map-get($light-color, 3);
  font-size: $font-size-sm;
  text-align: center;
  a:hover {
    text-decoration: underline;
  }
}

.button-scrollTop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  cursor: pointer;

  svg {
    width: 2rem;
    height: 2rem;
    fill: map-get($light-color, 2);
  }
}

.copyright {
  small {
    font-size: 1em;
  }
  a {
    color: inherit;
  }
}
.menu {
  margin-bottom: 1rem;
}
.menu-list {
  display: inline-flex;
}
.menu-item {
  & + & {
    margin-left: map-get($size, sm) * 1rem;
  }
  a {
    color: map-get($light-color, 2);
  }
}
</style>
