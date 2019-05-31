<template>
  <div class="c-adsense post-ads">
    <no-ssr>
      <adsbygoogle :ad-slot="adsense.slot" :ad-layout="adsense.layout" :ad-format="adsense.format" />
    </no-ssr>
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
