<template>
  <section v-if="tag_id > 0">
    <div class="c-title">
      <h1 class="title-main">{{ tag_name }}</h1>
    </div>
    <PostsList :tag-id="tag_id" mode="tags"/>
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
      title: this.tag_name,
    };
  },
  data() {
    return {
      tag_name: '',
      tag_id: 0,
    };
  },
  async mounted() {
    await this.$axios
      .get('wp/v2/tags', {
        params: {
          slug: this.$route.params.slug,
        },
      })
      .then(res => {
        this.tag_id = res.data[0].id;
        this.tag_name = res.data[0].name;
      });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('posts/resetList');
    next();
  },
};
</script>

<style>
</style>
