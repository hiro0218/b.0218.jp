import { css } from '@/ui/styled';

const Footnotes = css`
  [data-footnotes] {
    padding-top: var(--space-3);
    margin-top: var(--space-6);
    font-size: var(--font-size-sm);
    color: var(--text-11);
    border-top: 1px solid var(--borders-6);

    li {
      counter-increment: steps;
      padding-left: var(--space-½);

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
