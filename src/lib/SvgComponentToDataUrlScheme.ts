import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

export const SvgComponentToDataUrlScheme = (Component: ReactElement) => {
  const SVG = renderToString(Component);
  return 'data:image/svg+xml,' + encodeURIComponent(SVG);
};
