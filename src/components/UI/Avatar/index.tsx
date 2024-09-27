import { Stack } from '@/components/UI/Layout';
import { styled } from '@/ui/styled';

export const Avatar = function Avatar() {
  return (
    <Stack align="center" direction="horizontal" space={1}>
      <IconContainer>
        <img alt="" decoding="async" height="42" src="/hiro0218.svg" width="42" />
      </IconContainer>
      <Stack as="header" space={1}>
        <Name>hiro</Name>
        <Text>web developer</Text>
      </Stack>
    </Stack>
  );
};

const IconContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  user-select: none;

  img {
    border-radius: var(--border-radius-full);
  }
`;

const Text = styled.span`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-xs);
  color: var(--text-11);
`;

const Name = styled(Text)`
  font-weight: var(--font-weight-bold);
  color: var(--text-12);
`;
