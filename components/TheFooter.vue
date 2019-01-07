<template>
  <footer>
    <div class="copyright">
      <small>©
        <nuxt-link to="/">{{ siteName }}</nuxt-link>
      </small>
    </div>
    <div class="menu">
      <ul>
        <li>
          <nuxt-link to="/archive">archive</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/category">category</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/tag">tag</nuxt-link>
        </li>
      </ul>
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

<style>
</style>
