<template>
  <section class="error-container">
    <header class="c-heading">
      <h1 class="c-heading__title">
        <template v-if="error.statusCode >= 500">
          予期せぬエラーが発生しました
        </template>
        <template v-else>
          お探しのページは見つかりませんでした
        </template>
      </h1>
      <div class="c-heading__description">
        {{ error.message }}
      </div>
    </header>
    <section class="error-message">
      <p v-if="error.statusCode >= 500">
        技術的な問題が発生しているため、このページを表示できません。
      </p>
      <p v-else>
        このページは削除されたかURLが変更されています。
      </p>
    </section>
    <footer>
      <nuxt-link to="/" class="button">
        トップページに戻る
      </nuxt-link>
    </footer>
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
  head() {
    return {
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    };
  },
};
</script>

<style lang="scss">
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;

  .error-message {
    margin-bottom: 2rem;
  }

  .button {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    justify-content: center;
    padding: 0.75em 2em;
    border: 1px solid map-get($light-color, 1);
    border-radius: 0.15rem;
    color: $base-color;
    font-size: $font-size-xs;
    white-space: nowrap;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
