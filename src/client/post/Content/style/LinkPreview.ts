import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { lineClamp, textEllipsis } from '@/ui/mixin';
import { css } from '@/ui/styled';

const LinkPreview = css`
  .p-link-preview {
    display: flex;
    align-items: center;
    height: 120px;
    overflow: hidden;
    color: var(--text-12);
    text-decoration-line: unset;
    background-color: var(--backgrounds-1);
    border: 1px solid var(--borders-7);
    border-radius: var(--border-radius-8);

    &:hover {
      border-color: var(--borders-8);
    }

    &[target='_blank']::after {
      content: none;
    }

    &[data-card='summary_large_image'] {
      ${isDesktop} {
        .p-link-preview-body {
          padding: var(--space-2);
        }

        .p-link-preview-thumbnail {
          width: calc(var(--container-width) / 230px);
          max-width: 230px;
          height: 120px;
        }
      }
    }
  }

  .p-link-preview-body {
    display: block;
    flex: 1 1;
    width: calc(100% - 120px);
    padding: 0 var(--space-2);
    padding-left: var(--space-2);
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
    -webkit-line-clamp: 1;

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
    width: 120px;
    height: 120px;
    overflow: hidden;
    user-select: none;
    border-radius: var(--border-radius-8) 0 0 var(--border-radius-8);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export default LinkPreview;
