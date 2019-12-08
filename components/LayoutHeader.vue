<template functional>
  <header>
    <div :class="!props.isLarge ? 'c-heading' : 'c-heading--large'">
      <h1 class="c-heading__title">
        <slot name="header-title" />
      </h1>
    </div>
    <slot />
  </header>
</template>

<script>
export default {
  name: 'LayoutHeader',
  props: {
    isLarge: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
