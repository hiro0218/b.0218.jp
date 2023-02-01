import { isMobile } from '@/ui/lib/mediaQuery';
import { css } from '@/ui/styled';

const LinkPreview = css`
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
`;

export default LinkPreview;
