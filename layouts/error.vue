<template>
  <section class="error-container">
    <header class="c-title">
      <h1 class="title-main">{{ error.statusCode }}</h1>
      <div class="title-sub">{{ error.message }}</div>
    </header>
  </section>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss">
.error-container {
  text-align: center;
  .title-main {
    font-size: 2rem;
  }
}
</style>
