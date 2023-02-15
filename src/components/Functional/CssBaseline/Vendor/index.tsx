import 'highlight.js/styles/a11y-light.css';

import { css } from '@/ui/styled';

export default css`
  /* hljs */
  pre code.hljs {
    padding: var(--space-3);
    overflow-x: auto;
    color: var(--text-12);
    background: var(--backgrounds-2);
  }

  /* twitter */
  .twitter-tweet.twitter-tweet-rendered {
    margin-right: auto;
    margin-left: auto;
  }
`;
