<template>
  <section v-if="related.length !== 0" class="post-related">
    <header class="post-related-header">
      <h2 class="post-related-header__title">関連記事</h2>
    </header>
    <div class="o-post-list">
      <template v-for="post in related">
        <router-link :key="post.id" :to="post.url" class="o-post-list__item">
          <LayoutCard :title="post.title" :thumbnail="post.image">
            <template v-slot:card-footer>
              <time :datetime="post.date">{{ post.date | formatDateString }}</time>
            </template>
          </LayoutCard>
        </router-link>
      </template>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import LayoutCard from '~/components/LayoutCard.vue';

export default {
  name: 'PostRelated',
  components: {
    LayoutCard,
  },
  computed: {
    ...mapState('post', {
      related: state => state.data.attach.related,
    }),
  },
};
</script>

<style lang="scss" scoped>
.post-related-header {
  margin-bottom: 3rem;
  text-align: center;
}
</style>
