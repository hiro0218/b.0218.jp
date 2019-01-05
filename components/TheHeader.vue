<template>
  <header>
    <nuxt-link to="/">{{ siteName }}</nuxt-link>
    <SearchInput/>
  </header>
</template>

<script>
import SearchInput from '~/components/SearchInput.vue';

export default {
  name: 'TheHeader',
  components: {
    SearchInput,
  },
  computed: {
    siteName: () => process.env.SITE_NAME,
  },
};
</script>

<style>
</style>
