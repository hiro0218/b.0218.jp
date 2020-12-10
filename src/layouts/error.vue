<template>
  <section class="error">
    <LayoutHeader :heading="pageTitle" :description="error.message" />
    <section class="error__message">
      {{ pageMessage }}
    </section>
  </section>
</template>

<script type="ts">
import { computed,defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  setup({ error }) {
    const pageTitle = computed(() => {
      return error.statusCode >= 500 ? '予期せぬエラーが発生しました' : 'お探しのページは見つかりませんでした';
    });
    const pageMessage = computed(() => {
      return error.statusCode >= 500 ? '技術的な問題が発生しているため、このページを表示できません。' : 'このページは削除されたかURLが変更されています。';
    });

    return {
      pageTitle,
      pageMessage,
    }
  },
  head() {
    return {
      titleTemplate: null,
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    };
  },
});
</script>
