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
  computed: {
    isTagsPage: function() {
      return this.$route.params.terms === 'tags';
    },
    categoryPosts: function() {
      if (this.isTagsPage) {
        return [];
      }

      const category_posts = categories_posts.filter((post, i) => {
        return post.slug === this.$route.params.slug;
      });

      return category_posts.length !== 0 ? category_posts[0].posts : [];
    },
    tagsPosts: function() {
      if (!this.isTagsPage) {
        return [];
      }

      const tag_posts = tags_posts.filter((post, i) => {
        return post.slug === this.$route.params.slug;
      });

      return tag_posts.length !== 0 ? tag_posts[0].posts : [];
    },
    categoryList: () => categories,
    isErrorRedirect: function() {
      // タグ・カテゴリページで記事がない
      return (this.isTagsPage && this.tagsPosts.length === 0) || (!this.isTagsPage && this.categoryPosts.length === 0);
    },
  },
  mounted() {
    if (this.isErrorRedirect) {
      this.$nuxt.error({ statusCode: 404, message: 'Page not found' });
    }
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
