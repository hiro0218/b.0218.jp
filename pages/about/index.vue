<template>
  <article class="about">
    <LayoutHeader :is-large="true">
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
    </LayoutHeader>
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
import LayoutHeader from '~/components/LayoutHeader.vue';

export default {
  name: 'About',
  components: {
    LayoutHeader,
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
