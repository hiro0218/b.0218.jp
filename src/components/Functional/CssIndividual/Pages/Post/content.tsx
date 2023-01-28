import { isMobile } from '@/ui/lib/mediaQuery';
import { showHoverShadow } from '@/ui/mixin';
import { css, styled } from '@/ui/styled';

const Headings = css`
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
    scroll-margin-top: 1em;
    font-weight: var(--font-weight-bold);

    & > {
      code {
        font-size: 1em;
      }
    }

    & + :where(*) {
      margin-top: auto;
    }
  }

  ${[2, 3, 4, 5, 6].map((headingNumber: number) => {
    const tag = `h${headingNumber}`;
    const style = {
      marginTop: `${headingNumber >= 2 ? 'var(--space-5)' : headingNumber >= 5 ? 'var(--space-4)' : 'var(--space-3)'}`,
      marginBottom: `${headingNumber >= 3 ? 'var(--space-3)' : 'var(--space-2)'}`,
      lineHeight: 1.5,
    };

    return css`
      ${tag} {
        ${style}
      }
    `;
  })}
`;

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

  .p-table-scroll {
    position: relative;
    isolation: isolate;
    margin-left: -0.5em;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      border-radius: var(--border-radius-4);
      background-color: var(--backgrounds-2);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: var(--border-radius-4);
      background-color: var(--solid-backgrounds-9);
    }
  }

  .p-link-preview {
    display: flex;
    align-items: center;
    height: 150px;
    overflow: hidden;
    border: 1px solid var(--borders-7);
    border-radius: var(--border-radius-8);
    background-color: #fff;
    text-decoration: none;

    ${isMobile} {
      flex-direction: column;
      height: auto;
    }

    &:hover {
      border-color: var(--borders-8);
      background-color: var(--backgrounds-2);
    }

    &::after {
      content: '';
      display: none;
    }

    &-body {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      padding: var(--space-3);
      color: var(--text-12);

      ${isMobile} {
        order: 1;
        width: 100%;
      }

      &__title,
      &__description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &__title {
        max-height: 3em;
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-bold);
        line-height: 1.5;
      }

      &__description {
        display: block;
        margin-top: var(--space-half);
        overflow: hidden;
        color: var(--text-11);
        font-size: var(--font-size-sm);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__url {
        display: block;
        margin-top: auto;
        overflow: hidden;
        font-size: var(--font-size-sm);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &-thumbnail {
      width: 300px;
      height: 150px;
      background-color: #fff;
      user-select: none;

      ${isMobile} {
        order: 0;
        width: 100%;
        max-width: 100%;
        height: 240px;
      }

      img {
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;

        ${isMobile} {
          /* object-fit: contain; */
        }
      }
    }
  }

  [data-footnotes] {
    margin-top: var(--space-6);
    padding-top: var(--space-3);
    border-top: 1px solid var(--borders-6);
    color: var(--text-11);
    font-size: var(--font-size-sm);

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

export default PostContent;
