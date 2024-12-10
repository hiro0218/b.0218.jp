import { isMobile } from '@/ui/lib/mediaQuery';
import { hoverLinkStyle } from '@/ui/mixin';
import { css } from '@/ui/styled';

import Footnotes from './Footnotes';
import GfmAlert from './GfmAlert';
import Headings from './Heading';
import Highlight from './Highlight';
import LinkPreview from './LinkPreview';

const PostContentStyle = css`
  font-size: var(--font-size-post-content);
  color: var(--color-gray-11);

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
      text-decoration-color: var(--color-gray-11);
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
    width: 1.5em;
    height: 1.5em;
    margin: auto;
    font-size: 1em;
    color: var(--color-gray-11);
    text-decoration: none;
    user-select: none;
    border-radius: var(--border-radius-full);

    ${hoverLinkStyle}

    &:hover {
      color: var(--color-gray-12);
    }

    ${isMobile} {
      position: static;
    }
  }

  ${Headings}

  blockquote {
    padding: var(--space-3);
    color: var(--color-gray-11);
    border-left: 0.25rem solid var(--color-gray-6);

    cite {
      display: block;
      font-size: var(--font-size-xs);
      line-height: var(--line-height-sm);
      color: var(--color-gray-11);
    }
  }

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

    &:first-of-type {
      margin-block-start: 0;
    }

    blockquote {
      margin-top: var(--space-1);
    }

    ul:last-of-type {
      margin-block-end: var(--space-1);
    }
  }

  iframe {
    width: 100%;

    &[src*='youtube'] {
      height: auto;
      aspect-ratio: 16 / 9;
    }

    ${isMobile} {
      min-height: 320px;
    }
  }

  details {
    background-color: var(--white);

    summary {
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-gray-6);
      border-radius: var(--border-radius-4);

      & ~ * {
        margin: 0 var(--space-2) var(--space-2);
        font-size: var(--font-size-sm);

        > *:first-of-type {
          margin-top: auto;
        }
      }
    }

    &[open] {
      border: 1px solid var(--color-gray-7);
      border-radius: var(--border-radius-4);

      summary {
        border: none;
      }
    }
  }

  figure {
    margin: var(--space-3) auto;
  }

  hr {
    display: flex;
    align-items: center;
    width: 80%;
    margin: var(--space-5) auto;
    border: 0;

    &::after {
      display: block;
      width: 100%;
      height: var(--space-1);
      color: var(--color-gray-6);
      content: '';
      background-image: repeating-linear-gradient(
        -45deg,
        currentColor,
        currentColor 1px,
        transparent 0,
        transparent 50%
      );
      background-size: 6px 6px;
    }
  }

  ${GfmAlert}

  ${LinkPreview}

  ${Footnotes}

  ${Highlight}

  [data-sandbox] {
    margin: var(--space-3) auto;
    border: 1px solid var(--color-gray-6);
    border-radius: var(--border-radius-4);
  }
`;

export default PostContentStyle;
