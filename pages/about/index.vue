<template>
  <LayoutArticle :class-name="'about'">
    <template v-slot:postTitle>
      {{ pageTitle }}
    </template>
    <div class="post-content">
      <ul>
        <li>
          <nuxt-link to="about/me">
            運営者について
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="about/site">
            サイトについて
          </nuxt-link>
        </li>
      </ul>
    </div>
  </LayoutArticle>
</template>

<script>
const LayoutArticle = () => import('~/components/LayoutArticle.vue');

export default {
  name: 'About',
  head() {
    return {
      title: this.pageTitle,
    };
  },
  components: {
    LayoutArticle,
  },
  computed: {
    pageTitle: () => 'about',
  },
};
</script>

<style></style>
