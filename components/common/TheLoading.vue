<template>
  <div v-show="loading" :class="{ fadeOut: !loading }" class="c-loading">
    <div class="c-loading__icon" />
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
