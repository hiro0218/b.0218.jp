<template>
  <div>
    <ul>
      <li v-for="(post, index) in postList" :key="index">
        <nuxt-link :to="{ path: post.slug }">{{ post.title.rendered }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('post', {
      postList: state => state.list,
    }),
  },
};
</script>

<style>
</style>
