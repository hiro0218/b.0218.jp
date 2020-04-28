<template>
  <section v-if="id > 0" class="term">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ name }}
      </template>
      <template v-slot:header-description>
        {{ $route.params.terms }}
      </template>
    </LayoutHeader>
    <PostsCategoryList :current-path="$route.path" :list="categoryList" />
    <client-only>
      <PostsList :term-id="id" :mode="$route.params.terms" />
    </client-only>
  </section>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/list/PostsCategoryList.vue';

import categories from '~/_source/categories.json';

export default {
  name: 'TermsPostsList',
  components: {
    LayoutHeader,
    PostsList,
    PostsCategoryList,
  },
  async asyncData({ store, app, params, query, error }) {
    let id = 0;
    let name = '';
    let description = '';

    await app.$api
      .getTerms(params.terms, {
        params: {
          slug: params.slug,
        },
      })
      .then(res => {
        if (res.data.length === 0) {
          error({ statusCode: 404, message: 'Page not found' });
          return;
        }

        description = res.data[0].description;
        id = res.data[0].id;
        name = res.data[0].name;

        return store.dispatch('posts/fetch', {
          page: query.page,
          archiveParams: {
            [params.terms]: id,
          },
        });
      })
      .catch(e => {
        error(e);
      });

    return {
      description,
      id,
      name,
    };
  },
  computed: {
    categoryList: () => {
      return categories.sort(function(a, b) {
        return a.count < b.count ? 1 : -1;
      });
    },
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
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
