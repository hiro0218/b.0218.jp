<template>
  <section>
    <div class="c-title is-center">
      <h1 class="title-main">
        <slot name="postsListTitle" />
      </h1>
      <div class="title-sub">
        <slot name="postsListTitleSub" />
      </div>
    </div>
    <slot />
  </section>
</template>

<script>
export default {
  name: 'LayoutPostsList',
};
</script>

<style lang="scss" scoped></style>
