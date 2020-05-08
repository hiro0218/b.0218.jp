<template>
  <section class="term">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ $route.params.slug }}
      </template>
      <template v-slot:header-description>
        {{ $route.params.terms }}
      </template>
    </LayoutHeader>
    <PostsCategoryList v-if="!isTagsPage" :current-path="$route.path" :list="categoryList" />
    <PostsList :posts="isTagsPage ? tagsPosts : categoryPosts" />
  </section>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/list/PostsCategoryList.vue';

import categories_posts from '~/_source/categories_posts.json';
import tags_posts from '~/_source/tags_posts.json';
import categories from '~/_source/categories.json';

export default {
  name: 'TermsPostsList',
  components: {
    LayoutHeader,
    PostsList,
    PostsCategoryList,
  },
  async asyncData({ route, app, params, error, payload }) {
    const isTagsPage = params.terms === 'tags';

    // categoryPosts
    const category_posts = categories_posts.filter((post) => {
      return post.slug === params.slug;
    });

    const categoryPosts = category_posts.length !== 0 ? category_posts[0].posts : [];

    // tagsPosts
    const tag_posts = tags_posts.filter((post) => {
      return post.slug === params.slug;
    });

    const tagsPosts = tag_posts.length !== 0 ? tag_posts[0].posts : [];

    // 404
    if ((isTagsPage && tagsPosts.length === 0) || (!isTagsPage && categoryPosts.length === 0)) {
      error({ statusCode: 404, message: 'Page not found' });
    }

    return {
      isTagsPage: isTagsPage,
      categoryList: categories,
      categoryPosts: categoryPosts,
      tagsPosts: tagsPosts,
    };
  },
  head() {
    return {
      title: this.name,
      meta: [
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.SITE_URL}${this.$route.params.terms}/${this.$route.params.slug}`,
        },
        { hid: 'og:title', property: 'og:title', content: this.name },
        { hid: 'og:description', property: 'og:description', content: this.description },
      ],
    };
  },
  validate({ params }) {
    return (params.terms === 'categories' || params.terms === 'tags') && params.slug;
  },
};
</script>
