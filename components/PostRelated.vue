<template>
  <nav>
    <ul v-if="related">
      <li v-for="(post, index) in related" :key="index">
        <router-link :to="post.uri"> {{ post.title }} </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PostRelated',
  computed: {
    ...mapState('post', {
      related: state => state.data.attach.related,
    }),
  },
};
</script>

<style>
</style>
