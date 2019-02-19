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

<style>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contents-container {
  flex: 1 0 auto;
  min-height: 100vh;
}
</style>
