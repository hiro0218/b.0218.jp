import { blue, gray, green, orange, purple, red } from '@radix-ui/colors';

import { css } from '@/ui/styled/dynamic';

export default css`
  .hljs-comment,
  .hljs-code,
  .hljs-quote,
  .hljs-formula {
    color: ${gray.gray11};
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-meta .hljs-keyword,
  .hljs-template-tag,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable.language_ {
    color: ${red.red11};
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-tag,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-regexp,
  .hljs-deletion {
    color: ${red.red11};
  }

  .hljs-number,
  .hljs-built_in,
  .hljs-literal,
  .hljs-type,
  .hljs-params,
  .hljs-meta,
  .hljs-link {
    color: ${orange.orange11};
  }

  .hljs-variable,
  .hljs-params,
  .hljs-attr,
  .hljs-attribute {
    color: ${green.green11};
  }

  .hljs-string,
  .hljs-symbol,
  .hljs-addition {
    color: ${green.green11};
  }

  .hljs-bullet,
  .hljs-title,
  .hljs-section {
    color: ${blue.blue11};
  }

  /* stylelint-disable */
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-selector-pseudo {
    color: ${purple.purple11};
  }
  /* stylelint-enable */

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  @media screen and (-ms-high-contrast: active) {
    .hljs-addition,
    .hljs-attribute,
    .hljs-built_in,
    .hljs-bullet,
    .hljs-comment,
    .hljs-link,
    .hljs-literal,
    .hljs-meta,
    .hljs-number,
    .hljs-params,
    .hljs-string,
    .hljs-symbol,
    .hljs-type,
    .hljs-quote {
      color: highlight;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      font-weight: bold;
    }
  }
`;
