import { isMobile } from '@/ui/lib/mediaQuery';
import { showHoverShadow } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import Footnotes from './Footnotes';
import Headings from './Heading';
import LinkPreview from './LinkPreview';
import TableScroll from './TableScroll';

const PostContent = styled.div`
  & > * {
    margin-top: var(--space-2);
    margin-bottom: var(--space-3);

    & > p {
      margin-top: var(--space-1);
      margin-bottom: var(--space-1);
    }
  }

  > :where(p) {
    letter-spacing: 0.05em;
    line-height: 1.875;
    word-break: break-all;
  }

  a {
    text-decoration-line: underline;
    word-break: break-all;

    &:hover {
      text-decoration-color: var(--text-11);
    }

    :where(&[target='_blank']) {
      &::after {
        content: '↗';
        display: inline-block;
        margin: 0 0.15em;
        font-size: 80%;
        line-height: 1;
        text-decoration: none;
      }
    }
  }

  .anchor {
    display: inline-flex;
    position: absolute;
    top: 0;
    right: calc(100%);
    bottom: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    height: 100%;
    margin: 0;
    color: var(--text-11);
    text-decoration: none;
    user-select: none;

    ${isMobile} {
      position: static;
      margin-left: 0.25em;
    }
  }

  ${Headings}

  ul,
ol {
    padding-left: var(--space-4);

    ul,
    ol {
      margin: var(--space-half) 0 var(--space-3);
      padding-left: var(--space-4);
    }

    img {
      margin: 0.25em 0;
    }
  }

  li + li {
    margin-top: 0.5em;
  }

  blockquote {
    padding: var(--space-3);
    border-left: 0.25rem solid var(--borders-6);
    color: var(--text-11);

    p:last-child {
      margin-bottom: 0;
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;

    ${showHoverShadow}
  }

  figure {
    img {
      ${showHoverShadow}
    }
  }

  details {
    summary {
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius-4);
      background-color: var(--component-backgrounds-3);

      & ~ * {
        margin-right: var(--space-4);
        margin-left: var(--space-4);
      }
    }

    &[open] summary {
      margin-bottom: var(--space-4);
    }
  }

  hr {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: var(--space-6) 0;
    border: 0;

    &::before {
      content: '◇ ◆ ◇';
      color: var(--text-12);
      font-size: 1em;
    }
  }

  /**
   * @deprecated
   */
  .c-alert {
    padding: var(--space-3) var(--space-2);
    border-radius: var(--border-radius-4);
    background-color: var(--backgrounds-2);
    color: var(--text-11);

    a {
      color: var(--text-11);
    }
  }

  ${TableScroll}

  ${LinkPreview}

  ${Footnotes}
`;

export default PostContent;
