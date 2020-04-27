<template>
  <div v-show="loading" class="c-loading is-active" />
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
