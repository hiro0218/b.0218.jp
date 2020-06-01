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
      <div v-for="(archive, yaer) in archives" :key="yaer" class="archive-list">
        <div class="archive-year">
          <h2 class="archive-year__title">{{ yaer }}</h2>
        </div>
        <div class="archive-post">
          <div v-for="(post, index) in archive" :key="index" class="archive-post-list">
            <a :href="post.path" class="archive-post-item">
              <div class="archive-post-item__title">{{ post.title }}</div>
              <time :datetime="post.date" class="archive-post-item__date">{{
                convertDateToSimpleFormat(post.date)
              }}</time>
            </a>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { convertDateToSimpleFormat } from '~/assets/script/utils/date.ts';

const formatArchive = (srcArchives) => {
  const archives = {};

  for (let i = 0; i < srcArchives.length; i++) {
    const post = srcArchives[i];

    // 日付を取得する
    const date = new Date(post.date);
    const year = date.getFullYear();

    // 配列で初期化
    if (!Array.isArray(archives[year])) {
      archives[year] = [];
    }

    archives[year].push(post);
  }

  return archives;
};

export default defineComponent({
  name: 'Archive',
  setup(_, { root }) {
    const pageTitle = computed(() => 'Archive');
    const pageDescription = computed(() => 'これまでに公開した記事の一覧です。');
    const archives = computed(() => formatArchive(root.$source.archives));

    return {
      pageTitle,
      pageDescription,
      convertDateToSimpleFormat,
      archives,
    };
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [{ hid: 'description', name: 'description', content: this.pageDescription }],
    };
  },
});
</script>
