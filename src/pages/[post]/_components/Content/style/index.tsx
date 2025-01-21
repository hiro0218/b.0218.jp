import { css } from '@/ui/styled/dynamic';

import GfmAlert from './GfmAlert';
import Headings from './Heading';
import Highlight from './Highlight';

const PostContentStyle = css`
  ${Headings}

  ${GfmAlert}

  ${Highlight}
`;

export default PostContentStyle;
