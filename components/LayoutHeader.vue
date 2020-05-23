<template functional>
  <header>
    <div class="c-heading">
      <h1 class="c-heading__title">
        <slot name="header-title" />
      </h1>
      <div class="c-heading__description">
        <slot name="header-description" />
      </div>
    </div>
    <slot />
  </header>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'LayoutHeader',
});
</script>
