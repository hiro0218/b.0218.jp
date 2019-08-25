<template>
  <div v-show="loading" :class="{ fadeOut: !loading }" class="loading-container">
    <div class="loading" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data: () => ({
    loading: true,
  }),
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
    });
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style>
.loading-container {
  position: fixed;
  z-index: 15;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
}

.loading {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 4rem;
  height: 4rem;
  margin: auto;
  background: url('~assets/image/loading-spin.svg') center / cover no-repeat;
  /* background-size: cover; */
}
</style>
