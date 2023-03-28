import { isMobile } from '@/ui/lib/mediaQuery';
import { css } from '@/ui/styled';

const LinkPreview = css`
  .p-link-preview {
    display: flex;
    border: 1px solid var(--borders-7);
    border-radius: var(--border-radius-8);
    text-decoration-line: unset;
    background-color: var(--backgrounds-1);
    color: var(--text-12);
    overflow: hidden;

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
    display: block;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-link-preview-body__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: var(--space-½);
    color: var(--text-11);
    font-size: var(--font-size-sm);
    overflow: hidden;

    ${isMobile} {
      display: none;
    }
  }

  .p-link-preview-body__url {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-11);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
