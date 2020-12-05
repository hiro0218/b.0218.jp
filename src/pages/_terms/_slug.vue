<template>
  <section class="term">
    <LayoutHeader :title="termName" :description="$route.params.terms" />
    <PickupCategory v-if="!isTagsPage" :list="$source.categories" />
    <PostsList :posts="isTagsPage ? tagsPosts : categoriesPosts" />
  </section>
</template>

<script>
import CONSTANT from '~/constant';

export default {
  name: 'TermsPostsList',
  asyncData({ app, params, error }) {
    const isTagsPage = params.terms === 'tags';

    // categoryPosts
    const categoryPosts = app.$source.categoriesPosts.filter((post) => {
      return post.slug === params.slug;
    });

    const categoriesPosts = categoryPosts.length !== 0 ? categoryPosts[0].posts : [];

    // tagsPosts
    const tagPosts = app.$source.tagsPosts.filter((post) => {
      return post.slug === params.slug;
    });

    const tagsPosts = tagPosts.length !== 0 ? tagPosts[0].posts : [];

    // 404
    if ((isTagsPage && tagsPosts.length === 0) || (!isTagsPage && categoryPosts.length === 0)) {
      error({ statusCode: 404, message: 'Page not found' });
    }

    const termName = isTagsPage ? tagPosts[0].name : categoryPosts[0].name;

    return {
      isTagsPage,
      termName,
      categoriesPosts,
      tagsPosts,
    };
  },
  head() {
    return {
      title: this.$route.params.slug,
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${CONSTANT.SITE_URL}${this.$route.params.terms}/${this.$route.params.slug}`,
        },
        { hid: 'og:title', property: 'og:title', content: this.$route.params.slug },
      ],
    };
  },
  validate({ params }) {
    return (params.terms === 'categories' || params.terms === 'tags') && params.slug;
  },
};
</script>
