import { defineComponent, useMeta, computed } from '@nuxtjs/composition-api';
import CONSTANT from '../constant';

import LayoutHeader from '../components/LayoutHeader';
import PickupCategory from '../components/PickupCategory';
import PostsList from '../components/PostsList';

export default defineComponent({
  name: 'Top',
  setup(_, { root }) {
    const pageTitle = computed(() => '最新の記事');
    const siteDescription = computed(() => CONSTANT.SITE_DESCRIPTION);
    const posts = computed(() => {
      // @ts-ignore
      return root.context.$source.posts.filter((_, i: number) => i < 5);
    });
    // @ts-ignore
    const categories = root.context.$source.categories;

    useMeta({
      title: CONSTANT.SITE_NAME,
      titleTemplate: undefined,
    });

    return {
      pageTitle,
      siteDescription,
      posts,
      categories,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <section>
        <LayoutHeader title={this.pageTitle} description={this.siteDescription} />
        <PickupCategory list={this.categories} />
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
