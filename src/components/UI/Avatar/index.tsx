import { memo } from 'react';

import Icon from '@/assets/hiro0218.svg';
import { Stack } from '@/components/UI/Layout';
import { styled } from '@/ui/styled';

export const Avatar = memo(function Avatar() {
  return (
    <Stack align="center" direction="horizontal" space="1">
      <IconContainer>
        <Icon height="42" width="42" />
      </IconContainer>
      <Stack as="header" space="1">
        <Text as="b">hiro</Text>
        <Text>web developer</Text>
      </Stack>
    </Stack>
  );
});

const IconContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  user-select: none;

  svg {
    border-radius: var(--border-radius-full);
  }
`;

const Text = styled.span`
  font-size: var(--font-size-sm);
  line-height: 1.1;
  color: var(--text-11);
`;
