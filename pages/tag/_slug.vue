<template>
  <section v-if="id > 0">
    <LayoutPostsList>
      <template v-slot:postsListTitle>
        tag: {{ name }}
      </template>
      <template v-slot:postsListTitleSub>
        {{ description }}
      </template>
      <PostsCategoryList />
      <no-ssr>
        <PostsList :tag-id="id" mode="tags" />
      </no-ssr>
    </LayoutPostsList>
  </section>
</template>

<script>
import LayoutPostsList from '~/components/LayoutPostsList.vue';
import PostsList from '~/components/PostsList.vue';
import PostsCategoryList from '~/components/PostsCategoryList.vue';

export default {
  name: 'TagPostsList',
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
    return params.slug;
  },
  async asyncData({ store, app, params, query, error }) {
    let id = 0;
    let name = '';
    let description = '';

    await app.$api
      .getTags({
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
  async fetch({ store, params, query }) {
    store.dispatch('posts/fetchCategoryList');
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.dispatch('posts/resetList');
  //   next();
  // },
};
</script>
