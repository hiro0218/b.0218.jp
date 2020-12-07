import { defineComponent, useContext, useMeta } from '@nuxtjs/composition-api';
import CONSTANT from '~/constant';

import LayoutHeader from '~/components/LayoutHeader';
import PickupCategory from '~/components/PickupCategory';
import PostsList from '~/components/PostsList';

interface TermsPosts {
  title: string;
  path: string;
  excerpt: string;
  date: string;
}

interface TermsPostList {
  name: string;
  slug: string;
  count: number;
  posts: Array<TermsPosts>;
}

export default defineComponent({
  name: 'TermsPostsList',
  setup(_, { root }) {
    const { params } = useContext();
    const { slug, terms } = params.value;
    const isTagsPage = terms === 'tags';

    // validate
    if (!(terms === 'categories' || terms === 'tags')) {
      throw new Error('Page not found');
    }

    const { termName, termContent } = (() => {
      // @ts-ignore
      const termSource = isTagsPage ? root.context.$source.tagsPosts : root.context.$source.categoriesPosts;

      const posts: Array<TermsPostList> = termSource.filter((post: TermsPostList) => {
        return post.slug === slug;
      });

      return {
        termName: posts.length !== 0 ? posts[0].name : '',
        termContent: posts.length !== 0 ? posts[0].posts : [],
      };
    })();

    // 404
    if (termContent.length === 0) {
      throw new Error('Page not found');
    }

    useMeta({
      title: termName || slug,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${CONSTANT.SITE_URL}${terms}/${slug}`,
        },
        { hid: 'og:title', property: 'og:title', content: termName || slug },
      ],
    });

    return {
      terms,
      isTagsPage,
      termName,
      termContent,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <section class="term">
        <LayoutHeader heading={this.termName} description={this.terms} />
        {!this.isTagsPage && <PickupCategory />}
        <PostsList posts={this.termContent} />
      </section>
    );
  },
});
