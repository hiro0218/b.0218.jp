<template>
  <article class="post">
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
  mounted() {
    this.$nextTick(() => {
      this.$emit('mounted', true);
    });
  },
};
</script>

<style>
</style>
