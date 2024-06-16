import { SvgComponentToDataUrlScheme } from '@/lib/SvgComponentToDataUrlScheme';
import { ExternalLinkIcon } from '@/ui/icons';
import { css } from '@/ui/styled';

const IconExternalLink = SvgComponentToDataUrlScheme(<ExternalLinkIcon />);

/** 疑似要素に指定する */
export const IconExternalLinkStyle = css`
  display: inline-block;
  margin-left: 0.15em;
  vertical-align: middle;
  content: url(${IconExternalLink});
`;
