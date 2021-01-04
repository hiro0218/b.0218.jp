import { defineComponent, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import PostsList from '~/components/PostsList';
import { Archives } from '~/types/source';
import { SITE } from '~~/constant';

const recentPosts: Array<Archives> = require('~/_source/recent_posts.json');
const updatedPosts: Array<Archives> = require('~/_source/updates_posts.json');

export default defineComponent({
  name: 'Top',
  setup(_) {
    useMeta({
      title: SITE.NAME,
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
