<template>
  <footer>©
    <nuxt-link to="/">{{ siteName }}</nuxt-link>
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
