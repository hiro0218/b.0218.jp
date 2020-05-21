<template>
  <div class="c-adsense post-ads">
    <client-only>
      <adsbygoogle :ad-slot="adsense.slot" :ad-layout="adsense.layout" :ad-format="adsense.format" />
    </client-only>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PostAds',
  data() {
    return {
      adsense: {
        slot: '4045255408',
        layout: 'in-article',
        format: 'fluid',
      },
    };
  },
};
</script>
