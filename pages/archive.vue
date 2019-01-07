<template>
  <article>
    <header>
      <h1>{{ pageTitle }}</h1>
    </header>
    <div>
      <section v-for="(posts, year) in list" :key="year">
        <h2>{{ year }}</h2>
        <ul>
          <li v-for="post in posts" :key="post.id">
            <time :datetime="post.date">{{ post.date | dateToISOString }}</time>
            <nuxt-link :to="post.link">{{ post.title }}</nuxt-link>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  name: 'Archive',
  data() {
    return {
      list: null,
    };
  },
  computed: {
    pageTitle: () => 'Archive',
  },
  async mounted() {
    this.list = (await this.$axios.get('0218/v1/archive')).data;
  },
};
</script>

<style>
</style>
