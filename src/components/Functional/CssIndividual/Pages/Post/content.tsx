import { isMobile } from '@/ui/lib/mediaQuery';
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
    line-height: 1.875;
    letter-spacing: 0.05em;
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
        display: inline-block;
        margin: 0 0.15em;
        font-size: 80%;
        line-height: 1;
        text-decoration: none;
        content: '↗';
      }
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
      padding-left: var(--space-4);
      margin: var(--space-half) 0 var(--space-3);
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
    color: var(--text-11);
    border-left: 0.25rem solid var(--borders-6);

    p:last-child {
      margin-bottom: 0;
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;

    ${isMobile} {
      min-height: 320px;
    }
  }

  details {
    summary {
      padding: var(--space-2) var(--space-3);
      background-color: var(--component-backgrounds-3);
      border-radius: var(--border-radius-4);

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
      font-size: 1em;
      color: var(--text-12);
      content: '◇ ◆ ◇';
    }
  }

  /**
   * @deprecated
   */
  .c-alert {
    padding: var(--space-3) var(--space-2);
    color: var(--text-11);
    background-color: var(--backgrounds-2);
    border-radius: var(--border-radius-4);

    a {
      color: var(--text-11);
    }
  }

  ${TableScroll}

  ${LinkPreview}

  ${Footnotes}
`;

export default PostContent;
