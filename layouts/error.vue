<template>
  <section class="error-container">
    <header class="c-title">
      <h1 class="title-main">
        <template v-if="error.statusCode >= 400">
          お探しのページは見つかりませんでした
        </template>
        <template v-else>
          予期せぬエラー 予期せぬエラーが発生しました
        </template>
      </h1>
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
