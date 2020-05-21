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
    <PostsCategoryList v-if="!isTagsPage" :current-path="$route.path" :list="$source.categories" />
    <PostsList :posts="isTagsPage ? tagsPosts : categoryPosts" />
  </section>
</template>

<script>
export default {
  name: 'TermsPostsList',
  asyncData({ app, params, error }) {
    const isTagsPage = params.terms === 'tags';

    // categoryPosts
    // eslint-disable-next-line camelcase
    const category_posts = app.$source.categories_posts.filter((post) => {
      return post.slug === params.slug;
    });

    const categoryPosts = category_posts.length !== 0 ? category_posts[0].posts : [];

    // tagsPosts
    // eslint-disable-next-line camelcase
    const tag_posts = app.$source.tags_posts.filter((post) => {
      return post.slug === params.slug;
    });

    const tagsPosts = tag_posts.length !== 0 ? tag_posts[0].posts : [];

    // 404
    if ((isTagsPage && tagsPosts.length === 0) || (!isTagsPage && categoryPosts.length === 0)) {
      error({ statusCode: 404, message: 'Page not found' });
    }

    return {
      isTagsPage: isTagsPage,
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
