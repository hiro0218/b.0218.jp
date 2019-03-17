<template>
  <div class="search-container">
    <svgSearch/>
    <input
      v-model="searchValue"
      type="search"
      placeholder="Search"
      class="search-input"
      aria-label="Search box"
      @keyup.enter="setKeypress"
      @keydown.enter="submitSearch"
    >
  </div>
</template>

<script>
import svgSearch from '~/assets/image/search.svg?inline';

export default {
  name: 'SearchInput',
  components: {
    svgSearch,
  },
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
.search-container {
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    fill: $secondary-color;
  }
}

.search-input {
  width: 12rem;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  border: 1px solid transparent;
  border-radius: 0.15rem;
  outline: none;
  background: map-get($light-color, 3);
  font-size: $font-size-sm;
  line-height: 1;
  transition: background 0.1s ease;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:placeholder-shown,
  &::-webkit-input-placeholder {
    color: $secondary-color;
    font-size: $font-size-sm;
  }
  &:focus {
    border-color: map-get($light-color, 3);
    background: transparent;
  }
}
</style>
