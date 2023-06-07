import { css } from '@/ui/styled';

const Footnotes = css`
  [data-footnotes] {
    padding-top: var(--space-3);
    margin-top: var(--space-6);
    font-size: var(--font-size-sm);
    color: var(--text-11);
    border-top: 1px solid var(--borders-6);

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
