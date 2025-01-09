import { css } from '@/ui/styled/dynamic';

import hljsStyle from './hljs';

export default css`
  /* hljs */
  ${hljsStyle}

  pre code.hljs {
    padding: var(--space-3);
    overflow-x: auto;
  }

  /* twitter */
  .twitter-tweet.twitter-tweet-rendered {
    margin-right: auto;
    margin-left: auto;
  }
`;
