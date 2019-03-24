<template>
  <section v-if="id > 0">
    <no-ssr>
      <div class="c-title is-center">
        <h1 class="title-main">tag: {{ name }}</h1>
        <div class="title-sub">{{ description }}</div>
      </div>
      <PostsList :tag-id="id" mode="tags"/>
    </no-ssr>
  </section>
</template>

<script>
import PostsList from '~/components/PostsList.vue';

export default {
  name: 'TagPostsList',
  components: {
    PostsList,
  },
  head() {
    return {
      title: this.name,
    };
  },
  async asyncData({ store, $axios, params, query, error }) {
    let id = 0;
    let name = '';
    let description = '';

    await $axios
      .get('wp/v2/tags', {
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
            tags: id,
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
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>
