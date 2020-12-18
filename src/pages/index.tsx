import { defineComponent, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import PostsList from '~/components/PostsList';
import CONSTANT from '~/constant';
import { Post } from '~/types/source';

export default defineComponent({
  name: 'Top',
  setup(_, { root }) {
    // @ts-ignore
    const recentPosts: Array<Post> = root.context.$source.recentPosts;
    // @ts-ignore
    const updatedPosts: Array<Post> = root.context.$source.updatedPosts;

    useMeta({
      title: CONSTANT.SITE_NAME,
      titleTemplate: undefined,
    });

    return {
      recentPosts,
      updatedPosts,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <div>
        <section>
          <LayoutHeader heading="Recent Articles" description="最新の記事" />
          <PostsList posts={this.recentPosts} />
        </section>
        <section>
          <LayoutHeader heading="Updated Articles" description="更新された記事" />
          <PostsList posts={this.updatedPosts} />
        </section>
      </div>
    );
  },
});
