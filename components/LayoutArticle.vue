<template>
  <div :class="className" class="post">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'LayoutArticle',
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('mounted', true);
    });
  },
};
</script>
