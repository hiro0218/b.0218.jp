<template>
  <div class="c-adsense post-ads">
    <client-only>
      <ins
        class="adsbygoogle"
        style="display: block; text-align: center;"
        :data-ad-layout="layout"
        :data-ad-format="format"
        :data-ad-client="client"
        :data-ad-slot="slot"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CONSTANT from '~/constant';

export default defineComponent({
  name: 'PostAds',
  setup() {
    const { ADSENSE } = CONSTANT;
    const layout = computed(() => ADSENSE.LAYOUT);
    const format = computed(() => ADSENSE.FORMAT);
    const client = computed(() => ADSENSE.CLIENT);
    const slot = computed(() => ADSENSE.SLOT);

    return {
      layout,
      format,
      client,
      slot,
    };
  },
});
</script>
