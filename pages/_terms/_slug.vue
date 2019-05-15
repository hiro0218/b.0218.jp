<template>
  <section v-if="id > 0">
    <LayoutPostsList>
      <template v-slot:postsListTitle>
        {{ $route.params.terms }}: {{ name }}
      </template>
      <template v-slot:postsListTitleSub>
        {{ description }}
      </template>
      <PostsCategoryList />
      <no-ssr>
        <PostsList :term-id="id" :mode="$route.params.terms" />
      </no-ssr>
    </LayoutPostsList>
  </section>
</template>

<script>
import LayoutPostsList from '~/components/LayoutPostsList.vue';
import PostsList from '~/components/PostsList.vue';
import PostsCategoryList from '~/components/PostsCategoryList.vue';

export default {
  name: 'TermsPostsList',
  components: {
    LayoutPostsList,
    PostsList,
    PostsCategoryList,
  },
  head() {
    return {
      title: this.name,
    };
  },
  validate({ params }) {
    return (params.terms === 'categories' || params.terms === 'tags') && params.slug;
  },
  async asyncData({ store, app, params, query, error }) {
    let id = 0;
    let name = '';
    let description = '';

    await store.dispatch('posts/fetchCategoryList');
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
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
