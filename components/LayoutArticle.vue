<template>
  <article :class="className" class="post">
    <header class="c-title">
      <h1 class="title-main">
        <slot name="postTitle"/>
      </h1>
      <slot name="postMeta"/>
    </header>
    <slot/>
  </article>
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

<style>
</style>
