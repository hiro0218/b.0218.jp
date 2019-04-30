<template>
  <article :class="className" class="post">
    <header class="c-title">
      <h1 class="title-main">
        <slot name="postTitle" />
      </h1>
      <slot name="postMeta" />
    </header>
    <slot />
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

<style lang="scss" scoped>
.post {
  > .c-title {
    .title-main {
      margin-bottom: 0.5em;
      font-size: 2rem;
      @include mobile {
        font-size: $h2-font-size;
      }
    }
  }

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
          display: inline-block;
          width: 1em;
          height: 1em;
          content: '';
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
        right: calc(100% + 0.25em);
        top: 0;
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
