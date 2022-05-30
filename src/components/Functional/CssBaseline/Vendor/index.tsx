import 'highlight.js/styles/a11y-light.css';

import { css } from '@/ui/styled';

export default css`
  /* hljs */
  pre code.hljs {
    padding: 1.5rem;
    overflow-x: auto;
    background: var(--component-backgrounds-3);
    color: var(--text-12);
  }

  /* twitter */
  .twitter-tweet.twitter-tweet-rendered {
    margin-right: auto;
    margin-left: auto;
  }
`;
