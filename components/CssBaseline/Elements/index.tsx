import { css } from '@emotion/react';

import { mobile } from '@/lib/mediaQuery';

export default css`
  // global
  ::selection {
    background-color: rgba(0, 0, 0, 0.1);
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    padding-top: var(--header-height);
    color: var(--color-text);
    font-family: var(--font-family-sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.75;
    font-feature-settings: 'palt' 1;

    ${mobile} {
      font-size: 0.95rem;
    }

    &.is-no-scroll {
      overflow: hidden !important;
    }
  }

  a {
    transition: background 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease-in-out;
    color: var(--color-text-link);
    text-decoration: none;
    text-underline-position: under;
    text-decoration-color: var(--color-text--lighter);

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.25rem rgba(12, 12, 12, 0.25);
    }
  }

  figure {
    margin: var(--margin-base) 0;
    text-align: center;

    & img {
      margin-right: auto;
      margin-bottom: calc(var(--margin-base) * 0.5);
      margin-left: auto;
    }

    & figcaption {
      color: var(--color-text--lighter);
      font-size: var(--font-size-sm);
      text-align: center;
    }
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  // typography
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--gray-9);
    line-height: 1.25;
  }

  h1 {
    font-size: var(--h1-font-size);
  }
  h2 {
    font-size: var(--h2-font-size);
  }
  h3 {
    font-size: var(--h3-font-size);
  }
  h4 {
    font-size: var(--h4-font-size);
  }
  h5 {
    font-size: var(--h5-font-size);
  }
  h6 {
    font-size: var(--h6-font-size);
  }

  mark {
    background-color: var(--mark-bg-color);
  }

  // code
  pre,
  code {
    font-family: var(--font-family-monospace);
  }

  code {
    overflow-wrap: break-word;

    a > & {
      color: inherit;
    }
  }

  pre {
    display: block;
    overflow: auto;
    border-radius: 0.15rem;
    background: var(--bg-color--lighter);
    font-size: var(--font-size-sm);
    overflow-wrap: break-word;
    -webkit-overflow-scrolling: touch;
    resize: horizontal;

    & > code {
      display: block;
      padding: 1.5rem;
      background: var(--bg-color--lighter);
      color: #383a42;
      font-size: inherit;
      line-height: 1.8;
    }
  }

  :not(pre) > code {
    margin: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0.15rem;
    background: var(--bg-color--lighter);
    color: var(--color-text--light);
    font-size: var(--font-size-sm);
  }

  // table
  table {
    width: 100%;
    background: #fff;

    ${mobile} {
      table-layout: fixed;
    }
  }

  th,
  td {
    padding: 0.5rem 1rem;
    border-top: var(--table-border-width) solid var(--table-border-color);
    vertical-align: top;

    ${mobile} {
      white-space: nowrap;
    }
  }

  thead {
    & th {
      border-bottom: calc(var(--table-border-width) * 3) solid var(--table-border-color);
      text-align: left;
      vertical-align: bottom;
      white-space: nowrap;
    }
  }

  tbody {
    & tr {
      transition: background 0.3s ease;
      &:hover {
        background: var(--table-hover-color);
      }
    }
    & + tbody {
      border-top: calc(var(--table-border-width) * 2) solid var(--table-border-color);
    }
  }
`;
