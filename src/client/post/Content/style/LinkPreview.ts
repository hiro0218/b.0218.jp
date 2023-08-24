import { isMobile } from '@/ui/lib/mediaQuery';
import { lineClamp, textEllipsis } from '@/ui/mixin';
import { css } from '@/ui/styled';

const LinkPreview = css`
  .p-link-preview {
    display: flex;
    overflow: hidden;
    color: var(--text-12);
    text-decoration-line: unset;
    background-color: var(--backgrounds-1);
    border: 1px solid var(--borders-7);
    border-radius: var(--border-radius-8);

    &:hover {
      background-color: var(--component-backgrounds-4);
      border-color: var(--borders-8);
    }

    &[target='_blank']::after {
      content: none;
    }

    &[data-card='summary'] {
      align-items: center;
      height: 120px;

      .p-link-preview-body {
        width: calc(100% - 120px);
        padding-left: var(--space-2);
      }

      .p-link-preview-body__description {
        -webkit-line-clamp: 1;
      }

      .p-link-preview-thumbnail {
        width: 120px;
        height: 120px;
        border-radius: var(--border-radius-8) 0 0 var(--border-radius-8);
      }
    }

    &[data-card='summary_large_image'] {
      flex-direction: column;

      .p-link-preview-body {
        padding: var(--space-2);
      }

      .p-link-preview-thumbnail {
        width: calc(var(--container-width) / 320px);
        height: 320px;
        border-radius: var(--border-radius-8) var(--border-radius-8) 0 0;

        ${isMobile} {
          width: 100%;
          height: auto;

          img {
            object-fit: contain;
          }
        }
      }
    }
  }

  .p-link-preview-body {
    display: block;
    flex: 1;
    padding: 0 var(--space-2);
  }

  .p-link-preview-body__title {
    ${textEllipsis}

    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  .p-link-preview-body__description {
    ${lineClamp(2)}

    margin-top: var(--space-½);
    overflow: hidden;
    font-size: var(--font-size-sm);
    color: var(--text-11);

    ${isMobile} {
      display: none;
    }
  }

  .p-link-preview-body__url {
    ${textEllipsis}

    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-11);
  }

  .p-link-preview-thumbnail {
    display: flex;
    flex-basis: auto;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    user-select: none;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
`;

export default LinkPreview;
