import { isMobile } from '@/ui/lib/mediaQuery';
import { hoverLinkStyle } from '@/ui/mixin';
import { css } from '@/ui/styled/dynamic';

import GfmAlert from './GfmAlert';
import Headings from './Heading';
import Highlight from './Highlight';

const PostContentStyle = css`
  [data-mokuji-anchor] {
    position: absolute;
    top: 0;
    right: 100%;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    height: 1.5em;
    margin: auto;
    font-size: 1em;
    color: var(--color-gray-11);
    text-decoration: none;
    user-select: none;
    border-radius: var(--border-radius-full);

    ${hoverLinkStyle}

    &:hover {
      color: var(--color-gray-12);
    }

    ${isMobile} {
      position: static;
    }
  }

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
