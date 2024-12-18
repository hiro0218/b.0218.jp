import { css } from '@/ui/styled';
import { IconExternalLinkStyle } from '@/ui/styled/iconSets';

import { table } from './_table';

export default css`
  /* global */
  ::selection {
    background-color: var(--color-gray-5A);
    color: var(--color-gray-12);
  }

  * {
    scrollbar-width: thin;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    background-color: var(--body-background);
    font-family: var(--font-family-sans-serif);
    font-weight: var(--font-weight-normal);
    font-feature-settings: 'chws' 1;
    kerning: none;
    line-height: 1.875;
    color: var(--color-gray-12);
    line-break: strict;
    -webkit-font-smoothing: subpixel-antialiased;

    @media only screen and (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    &:has(dialog[open]) {
      overflow: clip;

      &,
      [data-floating] {
        padding-inline-end: var(--scrollbar-width, 0); // workaround for scrollbar gutter
      }
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      height: calc(var(--space-6) * 2);
      width: 100%;
      z-index: calc(var(--zIndex-base) * -1);
      isolation: isolate;
      background-image: linear-gradient(to top, var(--body-background) 0, hsla(0, 0%, 100%, 0) 100%),
        linear-gradient(to right, var(--background-accent-gradient-from) 0, var(--background-accent-gradient-to) 100%);
    }
  }

  a {
    color: var(--color-gray-12);
    text-decoration: none;
    text-decoration-color: var(--color-gray-8);
    text-underline-position: under;
    text-underline-offset: 2%;
    transition:
      background-color 0.2s ease,
      opacity 0.2s ease,
      box-shadow 0.2s ease-in-out,
      text-decoration-color 0.3s;
    overflow-wrap: break-word;

    &[target='_blank'] {
      // img,svg が含まれていない a 要素には外部リンクアイコンを付与
      &:not(:has(:is(img, svg))) {
        &::after {
          ${IconExternalLinkStyle}
        }
      }
    }

    &:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 2px var(--color-gray-7);
    }
  }

  figure {
    &:has(img) {
      text-align: center;
      font-size: var(--font-size-sm);

      > * + * {
        margin-top: var(--space-1);
      }

      img {
        display: block;
        margin-right: auto;
        margin-left: auto;
        border: 1px solid var(--color-gray-6);
      }
    }

    figcaption {
      color: var(--color-gray-11);
      font-size: var(--font-size-sm);
    }
  }

  ul {
    list-style: revert;
  }

  ol {
    list-style: decimal;
  }

  /* typography */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--color-gray-12);
    font-weight: var(--font-weight-normal);
    font-feature-settings: 'palt';
  }

  h1 {
    font-size: var(--font-size-h1);
    font-weight: var(--font-weight-bolder);
  }

  h2 {
    font-size: var(--font-size-h2);
  }

  h3 {
    font-size: var(--font-size-h3);
  }

  h4 {
    font-size: var(--font-size-h4);
  }

  h5 {
    font-size: var(--font-size-h5);
  }

  h6 {
    font-size: var(--font-size-h6);
  }

  b,
  strong {
    color: var(--color-gray-12);
    font-weight: var(--font-weight-bold);
  }

  mark {
    padding: 1px 2px;
    background-color: var(--color-gray-5A);
    border-radius: var(--border-radius-4);
  }

  /* code */
  pre,
  code {
    font-family: var(--font-family-monospace);
  }

  code {
    color: var(--color-gray-12);
    overflow-wrap: break-word;
    border-radius: var(--border-radius-4);
    background-color: var(--color-gray-1A);

    a > & {
      color: inherit;
    }
  }

  pre {
    display: block;
    overflow: auto;
    font-size: var(--font-size-sm);
    overflow-wrap: break-word;
    border: 1px solid var(--color-gray-6);
    border-radius: var(--border-radius-4);
    -webkit-overflow-scrolling: touch;
    /* stylelint-disable */
    resize: horizontal;
    /* stylelint-enable */

    & > code {
      display: block;
      padding: var(--space-3);
      background-color: var(--color-gray-2A);
      font-size: inherit;
    }
  }

  :not(pre) > code {
    padding: var(--space-½) var(--space-1);
    margin: 0;
    font-size: var(--font-size-sm);
    background: var(--color-gray-3A);
  }

  ${table}

  button {
    padding: 0;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
  }

  del {
    font-size: var(--font-size-sm);
    color: var(--color-gray-11);

    &[datetime] {
      &::before {
        display: inline-block;
        content: '（' attr(datetime) ' 削除）';
      }
    }
  }
`;
