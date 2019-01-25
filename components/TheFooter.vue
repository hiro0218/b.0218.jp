<template>
  <footer>
    <div class="o-container">
      <nav class="menu">
        <ul class="u-list-unstyled menu-list">
          <li class="menu-item">
            <nuxt-link to="/about">about</nuxt-link>
          </li>
          <li class="menu-item">
            <nuxt-link to="/archive">archive</nuxt-link>
          </li>
          <li class="menu-item">
            <nuxt-link to="/category">category</nuxt-link>
          </li>
          <li class="menu-item">
            <nuxt-link to="/tag">tag</nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="copyright">
        <small>©
          <nuxt-link to="/">{{ siteName }}</nuxt-link>
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
};
</script>

<style lang="scss" scoped>
footer {
  padding-bottom: 3rem;
  padding-top: 3rem;
  background: $oc-gray-8;
  color: $oc-gray-1;
  font-size: map-get($size, sm) * 1rem;
  text-align: center;
  a:hover {
    opacity: 0.6;
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
    color: $oc-gray-2;
  }
}
</style>
