<template>
  <section v-if="id > 0" class="term">
    <header class="c-title is-term">
      <h1 class="title-main">{{ name }}</h1>
      <div class="title-sub">
        {{ $route.params.terms }}
      </div>
    </header>
    <PostsCategoryList />
    <no-ssr>
      <PostsList :term-id="id" :mode="$route.params.terms" />
    </no-ssr>
  </section>
</template>

<script>
import PostsList from '~/components/list/PostsList.vue';
import PostsCategoryList from '~/components/PostsCategoryList.vue';

export default {
  name: 'TermsPostsList',
  components: {
    PostsList,
    PostsCategoryList,
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
