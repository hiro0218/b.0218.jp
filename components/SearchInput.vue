<template>
  <input
    v-model="searchValue"
    type="search"
    placeholder="Search"
    class="search-input"
    aria-label="Search box"
    @keyup.enter="setKeypress"
    @keydown.enter="submitSearch"
  >
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

<style lang="scss" scoped>
.search-input {
  width: 12rem;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.15rem;
  outline: none;
  background: $oc-gray-1;
  font-size: 1rem;
  transition: background 0.1s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:placeholder-shown,
  &::-webkit-input-placeholder {
    color: $oc-gray-6;
    font-size: $font-size-sm;
  }
  &:focus {
    border-color: $oc-gray-1;
    background: transparent;
  }
}
</style>
