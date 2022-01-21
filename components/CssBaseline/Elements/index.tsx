import { css } from '@emotion/react';

import { mobile } from '@/lib/mediaQuery';
import { getModularScale } from '@/lib/modular-scale';

export default css`
  /* global */
  ::selection {
    background-color: rgba(0, 0, 0, 0.1);
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    padding-top: var(--header-height);
    color: var(--text-12);
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
    transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease-in-out;
    color: var(--text-12);
    text-decoration: none;
    text-underline-position: under;
    text-decoration-color: var(--borders-8);

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.25rem var(--borders-8);
    }
  }

  figure {
    text-align: center;

    & img {
      display: block;
      border: 1px solid var(--borders-6);
      margin-right: auto;
      margin-left: auto;
    }

    & figcaption {
      margin-top: var(--space-x-sm);
      color: var(--text-11);
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

  /* typography */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--text-12);
    font-weight: 500;
  }

  h1 {
    font-size: ${getModularScale({ degree: 4 })};
    font-weight: 900;
  }

  h2 {
    font-size: ${getModularScale({ degree: 3 })};
  }

  h3 {
    font-size: ${getModularScale({ degree: 2 })};
  }

  h4 {
    font-size: ${getModularScale({ degree: 1 })};
  }

  h5,
  h6 {
    font-size: ${getModularScale({ degree: 0 })};
  }

  mark {
    background-color: var(--component-backgrounds-3);
  }

  /* code */
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
    background: var(--backgrounds-2);
    font-size: var(--font-size-sm);
    overflow-wrap: break-word;
    -webkit-overflow-scrolling: touch;
    resize: horizontal;

    & > code {
      display: block;
      padding: 1.5rem;
      background: var(--backgrounds-2);
      color: #383a42;
      font-size: inherit;
      line-height: 1.8;
    }
  }

  :not(pre) > code {
    margin: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0.15rem;
    background: var(--backgrounds-2);
    color: var(--text-12);
    font-size: var(--font-size-sm);
  }

  /* table */
  table {
    width: 100%;
    background: var(--backgrounds-1);
    font-size: var(--font-size-sm);

    ${mobile} {
      table-layout: fixed;
    }
  }

  th,
  td {
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--borders-6);
    vertical-align: top;

    ${mobile} {
      white-space: nowrap;
    }
  }

  thead {
    & th {
      border-top: none;
      border-bottom: 1px solid var(--borders-7);
      text-align: left;
      vertical-align: bottom;
      white-space: nowrap;
    }
  }

  tbody {
    & + tbody {
      border-top: 2px solid var(--borders-6);
    }

    &:last-child {
      border-bottom: 1px solid var(--borders-6);
    }

    tr {
      transition: background-color 0.3s ease;
      &:hover {
        background-color: var(--component-backgrounds-4);
      }
    }
  }
`;
