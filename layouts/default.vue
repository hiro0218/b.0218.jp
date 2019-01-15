<template>
  <main>
    <TheHeader/>
    <nuxt class="o-container contents"/>
    <TheFooter/>
  </main>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue';
import TheFooter from '~/components/TheFooter.vue';

export default {
  components: {
    TheHeader,
    TheFooter,
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}

.contents {
  flex: 1;
}
</style>
