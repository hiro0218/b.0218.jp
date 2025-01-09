import { svgComponentToDataUrlScheme } from '@/lib/svgComponentToDataUrlScheme';
import {
  ChatBubbleLeft,
  ExclamationCircle,
  ExclamationTriangle,
  ICON_SIZE_XS,
  InformationCircle,
  LightBulb,
} from '@/ui/icons';
import { css } from '@/ui/styled/dynamic';

const IconChatBubbleLeft = svgComponentToDataUrlScheme(<ChatBubbleLeft height={ICON_SIZE_XS} width={ICON_SIZE_XS} />);
const IconExclamationCircle = svgComponentToDataUrlScheme(
  <ExclamationCircle height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
);
const IconExclamationTriangle = svgComponentToDataUrlScheme(
  <ExclamationTriangle height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
);
const IconInformationCircle = svgComponentToDataUrlScheme(
  <InformationCircle height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
);
const IconLightBulb = svgComponentToDataUrlScheme(<LightBulb height={ICON_SIZE_XS} width={ICON_SIZE_XS} />);

const GfmAlert = css`
  .gfm-alert {
    --alert-color: var(--color-alert-note);

    padding: var(--space-1) var(--space-3);
    border-left: var(--space-½) solid var(--alert-color);

    .gfm-alert-title {
      display: inline-flex;
      align-items: center;
      font-weight: var(--font-weight-bold);
      color: var(--alert-color);

      &::before {
        display: block;
        width: ${ICON_SIZE_XS}px;
        height: ${ICON_SIZE_XS}px;
        margin-right: 0.5em;
        content: '';
        background-color: var(--alert-color);
        mask-repeat: no-repeat;
      }
    }

    &[data-alert-type='note'],
    &[data-alert-type='tip'] {
      .gfm-alert-title::before {
        mask-image: url(${IconInformationCircle});
      }
    }

    &[data-alert-type='tip'] {
      --alert-color: var(--color-alert-note);

      .gfm-alert-title::before {
        mask-image: url(${IconLightBulb});
      }
    }

    &[data-alert-type='important'] {
      --alert-color: var(--color-alert-important);

      .gfm-alert-title::before {
        mask-image: url(${IconChatBubbleLeft});
      }
    }

    &[data-alert-type='warning'] {
      --alert-color: var(--color-alert-warning);

      .gfm-alert-title::before {
        mask-image: url(${IconExclamationTriangle});
      }
    }

    &[data-alert-type='caution'] {
      --alert-color: var(--color-alert-caution);

      .gfm-alert-title::before {
        mask-image: url(${IconExclamationCircle});
      }
    }

    p {
      font-size: var(--font-size-sm);
    }
  }
`;

export default GfmAlert;
