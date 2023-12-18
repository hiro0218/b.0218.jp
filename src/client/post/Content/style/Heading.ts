import { css } from '@/ui/styled';

const generateHeadingStyles = (headingNumber: number) => {
  const tag = `h${headingNumber}`;
  const nextTagNumber = headingNumber + 1;
  const nextTagSiblingSelector = nextTagNumber <= 6 ? `${tag} + h${nextTagNumber}` : undefined;
  const marginTop = (() => {
    switch (headingNumber) {
      case 1:
      case 2:
        return 'var(--space-5)';
      case 3:
      case 4:
      case 5:
        return 'var(--space-4)';
      default:
        return 'var(--space-3)';
    }
  })();
  const marginBottom = (() => {
    switch (headingNumber) {
      case 1:
      case 2:
      case 3:
        return 'var(--space-3)';
      default:
        return 'var(--space-2)';
    }
  })();

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
