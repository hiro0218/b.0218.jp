import { mobile } from '@/lib/mediaQuery';
import { showHoverShadow } from '@/ui/mixin';
import { styled } from '@/ui/styled';

const PostContent = styled.article`
  & > * {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-xl);

    &:first-of-type {
      margin-top: 0;
    }

    & > p {
      margin-top: var(--space-xs);
      margin-bottom: var(--space-xs);

      &:first-of-type {
        margin-top: 0;
      }
    }
  }

  > :where(p) {
    letter-spacing: 0.05em;
    line-height: 1.875;
    word-break: break-all;
  }

  a {
    text-decoration-line: underline;
    word-break: break-all;

    &:hover {
      text-decoration-color: var(--text-11);
    }

    &[target='_blank'] {
      &::after {
        content: '↗';
        display: inline-block;
        text-decoration: none;
      }
    }
  }

  .anchor {
    display: inline-flex;
    position: absolute;
    top: 0;
    right: calc(100%);
    bottom: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    height: 100%;
    margin: 0;
    color: var(--text-11);
    text-decoration: none;
    user-select: none;

    ${mobile} {
      position: static;
      margin-left: 0.25em;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
    scroll-margin-top: 1em;

    & > {
      code {
        font-size: 1em;
      }
    }

    & + :where(*) {
      margin-top: auto;
    }
  }

  h2 {
    margin: var(--space-x-xl) auto var(--space-sm);
  }

  h3 {
    margin: var(--space-xl) auto var(--space-sm);
  }

  h4,
  h5,
  h6 {
    margin: var(--space-lg) auto var(--space-sm);
  }

  ul,
  ol {
    padding-left: var(--space-xl);
    letter-spacing: 0.05em;

    ul,
    ol {
      margin: var(--space-x-xs) 0 var(--space-md);
      padding-left: var(--space-lg);
    }

    img {
      margin: 0.25em 0;
    }
  }

  li + li {
    margin-top: 0.5em;
  }

  blockquote {
    padding: 1.5rem;
    border-left: 0.25rem solid var(--borders-6);
    color: var(--text-11);

    p:last-child {
      margin-bottom: 0;
    }
  }

  iframe {
    aspect-ratio: 16 / 9;

    ${showHoverShadow}
  }

  figure {
    img {
      ${showHoverShadow}
    }
  }

  hr {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: var(--space-x-xl) 0;
    border: 0;

    &::before {
      content: '◇ ◆ ◇';
      color: var(--text-12);
      font-size: 1em;
    }
  }

  .c-alert {
    padding: 1rem 1.25rem;
    border-radius: 0.25rem;
    background-color: var(--backgrounds-2);
    color: var(--text-11);

    a {
      color: var(--text-11);
    }
  }

  .p-table-scroll {
    position: relative;
    isolation: isolate;
    margin-left: -0.5em;

    &__shadow {
      display: flex;
      z-index: 1;
      overflow: auto;
      background: linear-gradient(to left, #fff, #fff 0.5em) left/0.5em 100%,
        linear-gradient(to left, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.12)) left/0.5em 100%,
        linear-gradient(to right, #fff, #fff 0) right/0.5em 100%,
        linear-gradient(to right, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.12)) right/0.5em 100%;
      background-attachment: local, scroll, local, scroll;
      background-repeat: no-repeat;

      &::before,
      &::after {
        content: '';
        width: 1px;
        height: 1px;
        margin: 0 calc(0.25em - 1px);
      }
    }
  }
`;

export default PostContent;
