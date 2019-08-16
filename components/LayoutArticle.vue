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

<style lang="scss" scoped>
.post {
  /deep/ .post-content {
    a {
      text-decoration: underline;
      &:hover {
        opacity: 0.6;
      }

      &.is-external_link {
        display: inline-flex;
        align-items: center;
        &::after {
          content: '';
          display: inline-block;
          width: 1em;
          height: 1em;
          background: url('~assets/image/open_in_new.svg') center / 1em 1em no-repeat;
        }
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      position: relative;
      .anchor {
        position: absolute;
        top: 0;
        right: calc(100% + 0.25em);
        bottom: 0;
        margin: auto;
        border: 0;
        color: map-get($light-color, 1);
        text-decoration: none;
        user-select: none;
        @include until($desktop) {
          position: static;
          margin-left: 0.25em;
        }
      }
    }

    h1,
    h2,
    h3 {
      margin-top: 3em;
    }

    h4,
    h5,
    h6 {
      margin-top: 2.5em;
    }

    ul,
    ol {
      li {
        margin-bottom: 0.625rem;
      }
    }
  }
}
</style>
