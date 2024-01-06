import { SvgComponentToDataUrlScheme } from '@/lib/SvgComponentToDataUrlScheme';
import { ExternalLinkIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css } from '@/ui/styled';

const IconExternalLink = SvgComponentToDataUrlScheme(<ExternalLinkIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />);

/** 疑似要素に指定する */
export const IconExternalLinkStyle = css`
  display: inline-block;
  margin-left: 0.15em;
  vertical-align: middle;
  content: url(${IconExternalLink});
`;
