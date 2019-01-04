<template>
  <div>
    <TheHeader/>
    <SearchInput/>
    <nuxt/>
    <TheFooter/>
  </div>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue';
import SearchInput from '~/components/SearchInput.vue';
import TheFooter from '~/components/TheFooter.vue';

export default {
  components: {
    TheHeader,
    TheFooter,
    SearchInput,
  },
};
</script>
