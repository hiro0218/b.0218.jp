<template>
  <article class="archive">
    <LayoutHeader>
      <template v-slot:header-title>
        {{ pageTitle }}
      </template>
      <template v-slot:header-description>
        {{ pageDescription }}
      </template>
    </LayoutHeader>
    <section>
      <ul class="archive-list">
        <li v-for="(post, key) in archiveList" :key="key" class="archive-item">
          <time :datetime="post.date" class="archive-item__date">{{ post.date | formatDateString }}</time>
          <a :href="post.path" class="archive-item__link">{{ post.title }}</a>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import LayoutHeader from '~/components/LayoutHeader.vue';
import archives from '~/_source/archives.json';

export default {
  name: 'Archive',
  components: {
    LayoutHeader,
  },
  computed: {
    pageTitle: () => 'Archive',
    pageDescription: () => 'これまでに公開した記事の一覧です。',
    archiveList: () => archives,
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [{ hid: 'description', name: 'description', content: this.pageDescription }],
    };
  },
};
</script>
