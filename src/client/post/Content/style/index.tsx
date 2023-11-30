import { SvgComponentToDataUrlScheme } from '@/lib/SvgComponentToDataUrlScheme';
import { ExternalLinkIcon, ICON_SIZE_XS } from '@/ui/icons';
import { isMobile } from '@/ui/lib/mediaQuery';
import { css } from '@/ui/styled';

import Footnotes from './Footnotes';
import GfmAlert from './GfmAlert';
import Headings from './Heading';
import Highlight from './Highlight';
import LinkPreview from './LinkPreview';
import TableScroll from './TableScroll';

export const IconExternalLink = SvgComponentToDataUrlScheme(
  <ExternalLinkIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
);

const PostContentStyle = css`
  color: var(--text-11);

  & > * {
    margin-top: var(--space-2);
    margin-bottom: var(--space-3);

    & > p,
    & > div {
      margin-top: var(--space-1);
      margin-bottom: var(--space-1);
    }
  }

  > :where(p) {
    letter-spacing: var(--letter-spacing-md);
    word-break: break-word;
    word-wrap: break-word;
  }

  a {
    text-decoration-line: underline;

    &:hover {
      text-decoration-color: var(--text-11);
    }

    :where(&[target='_blank']) {
      &::after {
        display: inline-block;
        margin-left: 0.15em;
        vertical-align: middle;
        content: url(${IconExternalLink});
      }
      /* stylelint-disable */
      &:has(img) {
        &::after {
          content: none;
        }
      }
      /* stylelint-enable */
    }
  }

  [data-mokuji-anchor] {
    position: absolute;
    top: 0;
    right: 100%;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--space-3);
    height: 100%;
    margin: 0;
    color: var(--text-11);
    text-decoration: none;
    user-select: none;

    ${isMobile} {
      position: static;
    }
  }

  ${Headings}

  ul,
  ol {
    padding-inline-start: var(--space-3);

    & + pre {
      margin-inline-start: var(--space-3);
    }
  }

  :where(li) > :is(ul, ol) {
    margin-block-start: 0;
  }

  li {
    margin-block-start: var(--space-½);

    &::marker {
      font-size: var(--font-size-sm);
    }

    &:first-of-type {
      margin-block-start: 0;
    }

    ul:last-of-type {
      margin-block-end: var(--space-1);
    }
  }

  blockquote {
    padding: var(--space-3);
    color: var(--text-11);
    border-left: 0.25rem solid var(--borders-6);
  }

  iframe {
    width: 100%;

    &[src*='youtube'] {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }

    ${isMobile} {
      min-height: 320px;
    }
  }

  details {
    summary {
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-sm);
      border: 1px solid var(--borders-6);
      border-radius: var(--border-radius-4);

      & ~ * {
        margin: var(--space-1);

        > *:first-of-type {
          margin-top: auto;
        }
      }
    }

    &[open] {
      border: 1px solid var(--borders-7);
      border-radius: var(--border-radius-4);

      summary {
        border: none;
      }
    }
  }

  hr {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: var(--space-5) 0;
    border: 0;

    &::before {
      font-size: var(--font-size-sm);
      color: var(--text-11);
      content: '◆◆◆';
    }
  }

  ${GfmAlert}

  ${TableScroll}

  ${LinkPreview}

  ${Footnotes}

  ${Highlight}
`;

export default PostContentStyle;
