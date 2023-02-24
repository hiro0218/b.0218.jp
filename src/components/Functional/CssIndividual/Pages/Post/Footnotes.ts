import { css } from '@/ui/styled';

const Footnotes = css`
  [data-footnotes] {
    margin-top: var(--space-6);
    padding-top: var(--space-3);
    border-top: 1px solid var(--borders-6);
    color: var(--text-11);
    font-size: var(--font-size-sm);

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
