import { Stack as _Stack } from '@/components/UI/Layout';
import type { PostProps } from '@/types/source';
import { ICON_SIZE_SM, InfoCircledIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

import { IconExternalLink } from '../Content/style';

type Props = Pick<PostProps, 'note'>;

function PostNote({ note }: Props) {
  if (!note) {
    return null;
  }

  return (
    <Stack as="aside" direction="horizontal" space="1">
      <InfoCircledIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </Stack>
  );
}

export default PostNote;

const Stack = styled(_Stack)`
  align-items: center;
  padding: var(--space-3) var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-11);
  background-color: var(--backgrounds-2);
  border-left: 4px solid var(--borders-6);
  border-radius: var(--border-radius-4);

  a {
    &[target='_blank'] {
      &::after {
        display: inline-block;
        margin-left: 0.15em;
        vertical-align: middle;
        content: url(${IconExternalLink});
      }
    }
    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    flex-shrink: 0;
  }
`;
