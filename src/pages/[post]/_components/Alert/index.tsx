import {
  ChatBubbleLeft,
  ExclamationCircle,
  ExclamationTriangle,
  ICON_SIZE_SM,
  InformationCircle,
  LightBulb,
} from '@/ui/icons';
import { styled } from '@/ui/styled/static';

export type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

type Props = {
  type: AlertType;
  text: string;
};

export const Alert = ({ type, text }: Props) => {
  const Icon = (() => {
    switch (type) {
      case 'note':
      case 'tip':
        return <InformationCircle height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;
      case 'important':
        return <LightBulb height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;
      case 'warning':
        return <ExclamationTriangle height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;
      case 'caution':
        return <ExclamationCircle height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;
      default:
        return <ChatBubbleLeft height={ICON_SIZE_SM} width={ICON_SIZE_SM} />;
    }
  })();

  return (
    <Container data-alert-type={type}>
      <Title>
        {Icon}&nbsp;{type}
      </Title>
      <p
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  --alert-color: var(--color-alert-note);

  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-left: var(--space-½) solid var(--alert-color);

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

  & > :where(*) {
    margin: 0;
  }

  p {
    font-size: var(--font-size-sm);
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--alert-color);
  text-transform: capitalize;
`;
