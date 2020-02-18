<template>
  <section class="post-related">
    <header class="post-related-header">
      <h2 class="post-related-header__title">関連記事</h2>
    </header>
    <ul>
      <li v-for="post in related" :key="post.id">
        <router-link :to="post.url">
          {{ post.title }}
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'PostRelated',
  props: {
    related: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>
