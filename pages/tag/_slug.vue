<template>
  <section v-if="tag_id > 0">
    <h1>{{ tag_name }}</h1>
    <PostList :tag-id="tag_id" mode="tags"/>
  </section>
</template>

<script>
import PostList from '~/components/PostList.vue';

export default {
  name: 'TagPostList',
  components: {
    PostList,
  },
  data() {
    return {
      tag_name: '',
      tag_id: 0,
    };
  },
  async mounted() {
    await this.$axios
      .get('tags', {
        params: {
          slug: this.$route.params.slug,
        },
      })
      .then(res => {
        this.tag_id = res.data[0].id;
        this.tag_name = res.data[0].name;
      });
  },
};
</script>

<style>
</style>
