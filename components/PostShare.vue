<template>
  <div class="c-sns-list">
    <a
      :href="'https://twitter.com/intent/tweet?url=' + postLink + '&text=' + encodeURIComponent(postTitle)"
      class="c-sns-list__item--twitter"
      title="Share Twitter"
      target="_blank"
      rel="noopener"
      v-html="svgTwitter"
    />
    <a
      :href="'https://www.facebook.com/sharer/sharer.php?u=' + postLink"
      class="c-sns-list__item--facebook"
      title="Share Facebook"
      target="_blank"
      rel="noopener"
      v-html="svgFacebook"
    />
    <a
      :href="'http://b.hatena.ne.jp/add?url=' + postLink"
      class="c-sns-list__item--hatenabookmark"
      title="Share HatenaBookmark"
      target="_blank"
      rel="noopener"
      v-html="svgHatena"
    />
    <a
      :href="'https://lineit.line.me/share/ui?url=' + postLink"
      class="c-sns-list__item--line"
      title="Share LINE"
      target="_blank"
      rel="noopener"
      v-html="svgLine"
    />
  </div>
</template>

<script type="ts">
import { defineComponent, computed } from '@vue/composition-api';

import svgLine from '~/assets/image/sns_line.svg?raw';
import svgHatena from '~/assets/image/sns_hatenabookmark.svg?raw';
import svgTwitter from '~/assets/image/sns_twitter.svg?raw';
import svgFacebook from '~/assets/image/sns_facebook.svg?raw';

export default defineComponent({
  name: 'PostShare',
  props: {
    postTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const postLink = computed(() => location.href);

    return {
      postLink,
      svgLine,
      svgHatena,
      svgTwitter,
      svgFacebook,
    };
  },
});
</script>
