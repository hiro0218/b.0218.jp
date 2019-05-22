<template>
  <div class="c-adsense post-ads">
    <adsbygoogle :ad-slot="adsense.slot" :ad-layout="adsense.layout" :ad-format="adsense.format" />
  </div>
</template>

<script>
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
