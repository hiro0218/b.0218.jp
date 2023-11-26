import { css } from '@/ui/styled';

const GfmAlert = css`
  .gfm-alert {
    border-left: var(--space-½) solid;
    padding: 0 var(--space-2);

    &[data-alert-type='note'],
    &[data-alert-type='tip'] {
      border-color: var(--color-alert-note);

      .gfm-alert-title {
        color: var(--color-alert-note);
      }
    }

    &[data-alert-type='important'] {
      border-color: var(--color-alert-important);

      .gfm-alert-title {
        color: var(--color-alert-important);
      }
    }

    &[data-alert-type='warning'] {
      border-color: var(--color-alert-warning);

      .gfm-alert-title {
        color: var(--color-alert-warning);
      }
    }

    &[data-alert-type='caution'] {
      border-color: var(--color-alert-caution);

      .gfm-alert-title {
        color: var(--color-alert-caution);
      }
    }
  }

  .gfm-alert-title {
    display: inline-flex;
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-½);
  }
`;

export default GfmAlert;
