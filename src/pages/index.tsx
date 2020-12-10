import { defineComponent, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import PickupCategory from '~/components/PickupCategory';
import PostsList from '~/components/PostsList';
import CONSTANT from '~/constant';
import { Post } from '~/types/source';

export default defineComponent({
  name: 'Top',
  setup(_, { root }) {
    // @ts-ignore
    const posts: Array<Post> = root.context.$source.posts.filter((_, i: number) => i < 5);

    useMeta({
      title: CONSTANT.SITE_NAME,
      titleTemplate: undefined,
    });

    return {
      posts,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <section>
        <LayoutHeader heading="最新の記事" description={CONSTANT.SITE_DESCRIPTION} />
        <PickupCategory />
        <PostsList posts={this.posts} />
        <div class="pg-home-list-more">
          <nuxt-link to="/archive" class="pg-home-list-more__button">
            もっと見る
          </nuxt-link>
        </div>
      </section>
    );
  },
});
