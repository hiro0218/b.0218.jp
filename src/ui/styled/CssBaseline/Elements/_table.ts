import { css } from '@/ui/styled';

export const table = css`
  @keyframes scroll-table-shadow-inset {
    0% {
      box-shadow:
        inset calc(var(--table-shadow-size) * -2) 0 var(--table-shadow-size) var(--table-shadow-spread)
          var(--table-shadow-color),
        inset 0 0 var(--table-shadow-size) var(--table-shadow-spread) var(--table-shadow-color);
    }
    10%,
    90% {
      box-shadow:
        inset calc(var(--table-shadow-size) * -1) 0 var(--table-shadow-size) var(--table-shadow-spread)
          var(--table-shadow-color),
        inset var(--table-shadow-size) 0 var(--table-shadow-size) var(--table-shadow-spread) var(--table-shadow-color);
    }
    100% {
      box-shadow:
        inset 0 0 var(--table-shadow-size) var(--table-shadow-spread) var(--table-shadow-color),
        inset calc(var(--table-shadow-size) * 2) 0 var(--table-shadow-size) var(--table-shadow-spread)
          var(--table-shadow-color);
    }
  }

  /* table */
  table {
    display: block flow;
    overflow-y: auto;
    overscroll-behavior-inline: contain;
    max-inline-size: 100%;
    animation: scroll-table-shadow-inset linear;
    animation-timeline: scroll(self x);

    caption {
      margin: var(--space-1) 0;
      color: var(--text-11);
      text-align: center;
    }
  }

  th,
  td {
    padding: var(--space-1) var(--space-2);
    white-space: nowrap;
    vertical-align: top;
    border-top: 1px solid var(--borders-6);
  }

  th {
    background-color: var(--component-backgrounds-4A);
    color: var(--text-12);
    text-align: left;

    ${['center', 'right'].map(
      (value) => css`
        &[align='${value}'] {
          text-align: ${value};
        }
      `,
    )}
  }

  thead {
    th {
      white-space: nowrap;
      vertical-align: bottom;
      border-top: none;
      border-bottom: 2px solid var(--borders-6);
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
        background-color: var(--component-backgrounds-3A);
      }
    }
  }
`;
