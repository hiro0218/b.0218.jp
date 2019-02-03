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
  flex-direction: column;
  justify-content: space-between;
}

.contents {
  flex: 1 0 auto;
  min-height: 100vh;
}
</style>
