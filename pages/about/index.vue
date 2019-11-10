<template>
  <article class="about">
    <header class="c-heading--large">
      <h1 class="c-heading__title">
        {{ pageTitle }}
      </h1>
    </header>
    <LayoutArticle :class-name="'about'">
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
  </article>
</template>

<script>
const LayoutArticle = () => import('~/components/LayoutArticle.vue');

export default {
  name: 'About',
  components: {
    LayoutArticle,
  },
  computed: {
    pageTitle: () => 'about',
  },
  head() {
    return {
      title: this.pageTitle,
    };
  },
};
</script>
