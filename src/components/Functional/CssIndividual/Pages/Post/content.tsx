import { SvgComponentToDataUrlScheme } from '@/lib/SvgComponentToDataUrlScheme';
import { RxExternalLink } from '@/ui/icons';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

import Footnotes from './Footnotes';
import Headings from './Heading';
import LinkPreview from './LinkPreview';
import TableScroll from './TableScroll';

const IconExternalLink = SvgComponentToDataUrlScheme(<RxExternalLink size={16} />);

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
      &:has(img) {
        &::after {
          content: none;
        }
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

  ul {
    padding-left: var(--space-1);

    li {
      padding-inline-start: var(--space-1);

      &::marker {
        padding-inline-start: var(--space-1);
        font-size: var(--font-size-lg);
        color: var(--text-11);
        content: '-';
      }
    }
  }

  ol {
    padding-left: var(--space-2);
  }

  ul,
  ol {
    ul,
    ol {
      padding-left: var(--space-2);
      margin: var(--space-½) 0 var(--space-2);
    }

    :where(*):not(ul, ol, li) {
      margin: var(--space-2) 0;
    }
  }

  li + li {
    margin-top: var(--space-½);
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
    margin: var(--space-5) 0;
    border: 0;

    &::before {
      font-size: var(--font-size-sm);
      color: var(--text-12);
      content: '◇ ◆ ◇';
    }
  }

  ${TableScroll}

  ${LinkPreview}

  ${Footnotes}
`;

export default PostContent;
