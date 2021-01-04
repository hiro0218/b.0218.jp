import { defineComponent, useContext, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import PostsList from '~/components/PostsList';
import { Terms } from '~/types/source';
import CONSTANT from '~~/constant';

const categoriesPosts: Array<Terms> = require('~/_source/categories_posts.json');
const tagsPosts: Array<Terms> = require('~/_source/tags_posts.json');

export default defineComponent({
  name: 'TermsPostsList',
  setup(_, { root }) {
    const { params } = useContext();
    const { slug, terms } = params.value;
    const isTagsPage = terms === 'tags';

    // validate
    if (!(terms === 'categories' || terms === 'tags')) {
      // @ts-ignore
      root.error({ statusCode: 404, message: 'Page not found' });
      return;
    }

    const { termName, termContent } = (() => {
      const termSource: Array<Terms> = isTagsPage ? tagsPosts : categoriesPosts;

      const posts = termSource.filter((post) => {
        return post.slug === slug;
      });

      return {
        termName: posts.length !== 0 ? posts[0].name : '',
        termContent: posts.length !== 0 ? posts[0].posts : [],
      };
    })();

    // 404
    if (termContent.length === 0) {
      // @ts-ignore
      root.error({ statusCode: 404, message: 'Page not found' });
      return;
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
      <div>
        {this.termContent && (
          <section class="term">
            <LayoutHeader heading={this.termName} description={this.terms} />
            <PostsList posts={this.termContent} />
          </section>
        )}
      </div>
    );
  },
});
