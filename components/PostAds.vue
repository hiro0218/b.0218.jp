<template>
  <div class="post-ads">
    <adsbygoogle :ad-slot="adsense.slot" :ad-layout="adsense.layout" :ad-format="adsense.format"/>
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

<style lang="scss">
.post-ads {
  margin: 1rem auto;
  max-width: 336px;
  min-height: 280px;
  @include mobile {
    min-height: 100px;
  }
}

.google-auto-placed {
  margin: 1rem auto;
}
</style>
