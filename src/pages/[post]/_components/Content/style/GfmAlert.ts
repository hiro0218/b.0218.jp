import { css } from '@/ui/styled';

const GfmAlert = css`
  .gfm-alert {
    --alert-color: var(--color-alert-note);

    border-left: var(--space-½) solid;
    padding: var(--space-1) var(--space-3);
    border-color: var(--alert-color);

    .gfm-alert-title {
      display: inline-flex;
      font-weight: var(--font-weight-bold);
      color: var(--alert-color);
    }

    &[data-alert-type='note'],
    &[data-alert-type='tip'] {
      --alert-color: var(--color-alert-note);
    }

    &[data-alert-type='important'] {
      --alert-color: var(--color-alert-important);
    }

    &[data-alert-type='warning'] {
      --alert-color: var(--color-alert-warning);
    }

    &[data-alert-type='caution'] {
      --alert-color: var(--color-alert-caution);
    }
  }
`;

export default GfmAlert;
