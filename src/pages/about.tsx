import { defineComponent, useAsync, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import { Pages } from '~/types/source';

const pages: Array<Pages> = require('~/_source/pages.json');

const pageTitle = 'About';
const pageDescription = 'サイトと運営者の情報';

export default defineComponent({
  name: 'About',
  setup(_, { root }) {
    useMeta({
      title: pageTitle,
      meta: [{ hid: 'description', name: 'description', content: pageDescription }],
    });

    const content = useAsync(() => {
      const page = pages.find((page: any) => page.slug === 'about');

      // @ts-ignore
      return root.context.$filteredPost(page.content);
    });

    return {
      content,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <article class="post">
        <LayoutHeader heading={pageTitle} description={pageDescription} />
        <div class="post__content js-post-content" domPropsInnerHTML={this.content} />
      </article>
    );
  },
});
