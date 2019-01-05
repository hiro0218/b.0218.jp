<template>
  <div>
    <input
      v-model="searchValue"
      type="search"
      placeholder="Search"
      @keyup.enter="setKeypress"
      @keydown.enter="submitSearch"
    >
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      searchValue: this.$route.query.search,
      isKeypressed: true,
    };
  },
  watch: {
    '$route.query.search'(query) {
      this.searchValue = query || '';
    },
  },
  methods: {
    // keyup
    setKeypress: function() {
      this.isKeypressed = true;
    },
    // keydown
    submitSearch: function() {
      if (this.searchValue && this.isKeypressed) {
        this.isKeypressed = false;
        this.$router.push({
          path: '/',
          query: { search: this.searchValue },
        });
      }
    },
  },
};
</script>

<style>
</style>
