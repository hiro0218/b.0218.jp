import { Cluster } from '@/components/UI/Layout/Cluster';
import { ExclamationCircle, ExclamationTriangle, ICON_SIZE_XS, InformationCircle, LightBulb } from '@/ui/icons';
import { css } from '@/ui/styled';

export type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';
type SanitizedHtml = string;

type Props = {
  type: AlertType;
  html: SanitizedHtml;
};

const SIZE = {
  height: ICON_SIZE_XS,
  width: ICON_SIZE_XS,
};

const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  note: <InformationCircle {...SIZE} aria-hidden="true" />,
  tip: <InformationCircle {...SIZE} aria-hidden="true" />,
  important: <LightBulb {...SIZE} aria-hidden="true" />,
  warning: <ExclamationTriangle {...SIZE} aria-hidden="true" />,
  caution: <ExclamationCircle {...SIZE} aria-hidden="true" />,
};

const ALERT_LABELS: Record<AlertType, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const ALERT_ROLES: Record<AlertType, 'note' | 'alert'> = {
  note: 'note',
  tip: 'note',
  important: 'note',
  warning: 'alert',
  caution: 'alert',
};

export const Alert = ({ type, html }: Props) => {
  const icon = ALERT_ICONS[type];
  const label = ALERT_LABELS[type];
  const role = ALERT_ROLES[type];

  return (
    <aside aria-label={`${label} alert`} className={containerStyle} data-alert-type={type} role={role}>
      <Cluster className={titleStyle} gap="½">
        {icon}
        {label}
      </Cluster>
      <p
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </aside>
  );
};

const containerStyle = css`
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-sizes-sm);
  color: var(--alert-color);
  background-color: var(--alert-background);
  border-radius: var(--radii-8);
  box-shadow: inset 0 0 0 1px var(--alert-border);

  /* stylelint-disable-next-line */
  ::selection {
    background-color: hwb(from var(--alert-color) h w b / 0.1);
  }

  &[data-alert-type='note'] {
    --alert-border: var(--colors-blue-400);
    --alert-color: var(--colors-blue-900);
    --alert-background: var(--colors-blue-100);
  }

  &[data-alert-type='tip'] {
    --alert-border: var(--colors-green-400);
    --alert-color: var(--colors-green-900);
    --alert-background: var(--colors-green-100);
  }

  &[data-alert-type='important'] {
    --alert-border: var(--colors-purple-400);
    --alert-color: var(--colors-purple-900);
    --alert-background: var(--colors-purple-100);
  }

  &[data-alert-type='warning'] {
    --alert-border: var(--colors-yellow-400);
    --alert-color: var(--colors-yellow-1000);
    --alert-background: var(--colors-yellow-100);
  }

  &[data-alert-type='caution'] {
    --alert-border: var(--colors-red-400);
    --alert-color: var(--colors-red-900);
    --alert-background: var(--colors-red-100);
  }

  & > :where(*) {
    margin: 0;
  }

  p {
    font-size: var(--font-sizes-sm);
  }
`;

const titleStyle = css`
  align-items: center;
  font-weight: var(--font-weights-bold);
  color: var(--alert-color);
`;
