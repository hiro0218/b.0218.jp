import { css } from '@/ui/styled';

const generateHeadingStyles = (headingNumber: number) => {
  const tag = `h${headingNumber}`;
  const nextTagNumber = headingNumber + 1;
  const nextTagSiblingSelector = nextTagNumber <= 6 ? `${tag} + h${nextTagNumber}` : undefined;
  const marginTop = headingNumber >= 2 ? 'var(--space-5)' : headingNumber >= 5 ? 'var(--space-4)' : 'var(--space-3)';
  const marginBottom = headingNumber >= 3 ? 'var(--space-3)' : 'var(--space-2)';

  const style = {
    marginTop,
    marginBottom,
    lineHeight: 'var(--line-height-md)',
  };

  const cancelMarginStyle = {
    marginTop: 0,
  };

  return css`
    ${tag} {
      ${style}
    }
    ${tag} + ${tag},
    ${nextTagSiblingSelector} {
      ${cancelMarginStyle}
    }
  `;
};

const Headings = css`
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
    scroll-margin-top: 1em;
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-md);
    letter-spacing: var(--letter-spacing-md);

    & > {
      code {
        font-size: 1em;
      }
    }

    & + :where(*) {
      margin-top: auto;
    }
  }

  ${[2, 3, 4, 5, 6].map((number) => generateHeadingStyles(number))}
`;

export default Headings;
