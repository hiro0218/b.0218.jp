<template>
  <article class="about">
    <header class="c-heading--large">
      <h1 class="c-heading__title">
        {{ pageTitle }}
      </h1>
    </header>
    <div class="post__content">
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
  </article>
</template>

<script>
export default {
  name: 'About',
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
