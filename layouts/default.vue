<template>
  <main class="main-container">
    <TheHeader/>
    <div class="o-container contents-container">
      <nuxt/>
    </div>
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

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contents-container {
  flex: 1 0 auto;
  min-height: calc(100vh - #{$header-height});
}
</style>
