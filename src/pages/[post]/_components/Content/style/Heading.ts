import { css } from '@/ui/styled';
import { SPACE_KEYS } from '@/ui/styled/CssBaseline/Settings/Space';

type HeadingTagNumber = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingTagNumber}`;

const generateHeadingStyles = (headingNumber: HeadingTagNumber) => {
  const tag: HeadingTag = `h${headingNumber}`;
  const nextTagNumber = headingNumber + 1;
  const nextTagSiblingSelector = nextTagNumber <= 6 ? `${tag} + h${nextTagNumber}` : undefined;
  const marginTop = (() => {
    switch (headingNumber) {
      case 1:
      case 2:
        return SPACE_KEYS[6];
      case 3:
      case 4:
      case 5:
        return SPACE_KEYS[5];
      default:
        return SPACE_KEYS[4];
    }
  })();
  const marginBottom = (() => {
    switch (headingNumber) {
      case 1:
      case 2:
      case 3:
        return SPACE_KEYS[3];
      default:
        return SPACE_KEYS[2];
    }
  })();
  const lineHeight = (() => {
    switch (headingNumber) {
      case 1:
        return '--line-height-lg';
      case 2:
        return '--line-height-md';
      default:
        return '--line-height-sm';
    }
  })();

  const style = {
    marginTop: `var(${marginTop})`,
    marginBottom: `var(${marginBottom})`,
    lineHeight: `var(${lineHeight})`,
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
    font-feature-settings: 'palt';
    font-kerning: normal;
    line-height: var(--line-height-md);
    text-wrap: pretty;
    letter-spacing: var(--letter-spacing-md);
    word-break: auto-phrase; // left -> pretty, center -> balance
    scroll-margin-top: 1em;

    & > {
      code {
        font-size: 1em;
      }
    }

    & + :where(*) {
      margin-top: auto;
    }
  }

  ${generateHeadingStyles(2)}
  ${generateHeadingStyles(3)}
  ${generateHeadingStyles(4)}
  ${generateHeadingStyles(5)}
  ${generateHeadingStyles(6)}

  h2 {
    &:first-child {
      margin-top: auto;
    }

    &:not(:has(+ h3)) {
      border-bottom: 1px solid var(--borders-6);
    }
  }
`;

export default Headings;
