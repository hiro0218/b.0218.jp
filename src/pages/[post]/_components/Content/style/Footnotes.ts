import { css } from '@/ui/styled/dynamic';

const Footnotes = css`
  [data-footnotes] {
    padding-top: var(--space-3);
    margin-top: var(--space-6);
    font-size: var(--font-size-sm);
    color: var(--color-gray-11);
    border-top: 1px solid var(--color-gray-6);

    li {
      padding-left: var(--space-½);
      counter-increment: steps;

      &::marker {
        letter-spacing: 1px;
        content: '[' counter(steps) ']';
      }

      & + li {
        margin-top: var(--space-1);
      }
    }

    p,
    h2 {
      margin: auto;
    }

    a {
      color: inherit;
    }

    [data-footnote-backref] {
      text-decoration-line: none;
    }
  }
`;

export default Footnotes;
