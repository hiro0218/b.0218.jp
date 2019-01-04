<template>
  <div>
    <input v-model="searchValue" type="search" placeholder="Search">
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      searchValue: this.$route.query.search,
    };
  },
  watch: {
    '$route.query.search'(query) {
      this.searchValue = query || '';
    },
  },
};
</script>

<style>
</style>
