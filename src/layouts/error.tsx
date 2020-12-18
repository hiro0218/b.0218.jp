import { computed, defineComponent, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';

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
      return error.statusCode >= 500
        ? '技術的な問題が発生しているため、このページを表示できません。'
        : 'このページは削除されたかURLが変更されています。';
    });

    useMeta({
      titleTemplate: undefined,
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    });

    return {
      pageTitle,
      pageMessage,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <section class="error">
        <LayoutHeader heading={this.pageTitle} description={this.error.message} />
        <div class="error__message">{this.pageMessage}</div>
      </section>
    );
  },
});
