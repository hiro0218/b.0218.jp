<template>
  <div class="c-search">
    <font-awesome-icon icon="search" class="c-search__icon" />
    <input
      v-model="searchValue"
      type="search"
      placeholder="Search"
      class="c-search__input"
      aria-label="Search box"
      @keyup.enter="setKeypress"
      @keydown.enter="submitSearch"
    />
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

<style lang="scss">
.c-search {
  display: flex;
  position: relative;
  align-items: center;
}

.c-search__icon {
  position: absolute;
  left: 0.5rem;
  width: 1rem;
  height: 1rem;
  color: $secondary-color;
}

.c-search__input {
  width: 12rem;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  transition: background 0.1s ease;
  border: 1px solid transparent;
  border-radius: 0.15rem;
  outline: none;
  background: map-get($light-color, 3);
  font-size: $font-size-sm;
  line-height: 1;
  -webkit-appearance: none;
  -moz-appearance: none;

  &::-webkit-input-placeholder,
  &:placeholder-shown {
    color: $secondary-color;
    font-size: $font-size-sm;
  }
  &:focus {
    border-color: map-get($light-color, 3);
    background: transparent;
    &::placeholder {
      color: transparent;
    }
  }
}
</style>
