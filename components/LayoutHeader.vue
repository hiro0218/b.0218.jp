<template functional>
  <header>
    <div class="c-heading">
      <h1 class="c-heading__title">
        {{ props.title }}
      </h1>
    </div>
    <slot />
  </header>
</template>

<script>
export default {
  name: 'LayoutHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
