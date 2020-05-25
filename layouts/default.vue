<template>
  <div class="layout-container">
    <TheHeader />
    <main class="o-container main-container">
      <nuxt />
    </main>
    <TheFooter />
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
.layout-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-container {
  flex: 1 0 auto;
  min-height: calc(100vh - #{$header-height});
  margin-bottom: 4rem;
}
</style>
