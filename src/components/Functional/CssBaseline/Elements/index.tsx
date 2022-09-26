import { getModularScale } from '@/lib/modular-scale';
import { css } from '@/ui/styled';

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
    color: var(--text-12);
    font-family: var(--font-family-sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: var(--font-weight-normal);
    line-height: 1.875;
    font-feature-settings: 'chws' 1;
    line-break: strict;
  }

  a {
    transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease-in-out, text-decoration-color 0.3s;
    color: var(--text-12);
    text-decoration: none;
    text-decoration-color: var(--borders-8);
    text-underline-position: under;
    text-underline-offset: 25%;

    &:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 2px var(--borders-7);
    }
  }

  figure {
    text-align: center;

    & img {
      display: block;
      margin-right: auto;
      margin-left: auto;
      border: 1px solid var(--borders-6);
    }

    & figcaption {
      margin-top: var(--space-xs);
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
    font-weight: var(--font-weight-normal);
  }

  h1 {
    font-size: ${getModularScale({ degree: 4 })};
    font-weight: var(--font-weight-bold);
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
    /* stylelint-disable */
    resize: horizontal;
    /* stylelint-enable */

    & > code {
      display: block;
      padding: 1.5rem;
      background: var(--backgrounds-2);
      color: var(--text-12);
      font-size: inherit;
      line-height: 1.875;
    }
  }

  :not(pre) > code {
    margin: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0.15rem;
    background: var(--component-backgrounds-3);
    color: var(--text-12);
    font-size: var(--font-size-sm);
    text-align: left;
  }

  /* table */
  table {
    width: 100%;
  }

  th,
  td {
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--borders-6);
    vertical-align: top;
    white-space: nowrap;
  }

  th {
    background-color: var(--component-backgrounds-3);
  }

  td {
    font-size: var(--font-size-sm);
  }

  thead {
    th {
      border-top: none;
      border-bottom: 2px solid var(--borders-6);
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
