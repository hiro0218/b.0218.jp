import { css } from '@/ui/styled/dynamic';

import GfmAlert from './GfmAlert';
import Headings from './Heading';
import Highlight from './Highlight';

const PostContentStyle = css`
  ${Headings}

  ${GfmAlert}

  ${Highlight}

  [data-sandbox] {
    margin: var(--space-3) auto;
    border: 1px solid var(--color-gray-6);
    border-radius: var(--border-radius-4);
  }
`;

export default PostContentStyle;
