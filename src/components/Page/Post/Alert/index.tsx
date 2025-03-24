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

const SIZE = {
  height: ICON_SIZE_SM,
  width: ICON_SIZE_SM,
};

export const Alert = ({ type, text }: Props) => {
  const Icon = (() => {
    switch (type) {
      case 'note':
      case 'tip':
        return <InformationCircle {...SIZE} />;
      case 'important':
        return <LightBulb {...SIZE} />;
      case 'warning':
        return <ExclamationTriangle {...SIZE} />;
      case 'caution':
        return <ExclamationCircle {...SIZE} />;
      default:
        return <ChatBubbleLeft {...SIZE} />;
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
  padding: var(--space-2) var(--space-3);
  background-color: hwb(from var(--alert-color) h w b / 0.1);
  border-left: var(--space-½) solid var(--alert-color);

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
