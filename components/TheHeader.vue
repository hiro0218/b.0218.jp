<template>
  <header>
    <nuxt-link to="/">{{ siteName }}</nuxt-link>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
};
</script>

<style>
</style>
