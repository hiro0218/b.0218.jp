import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const SvgComponentToDataUrlScheme = (Component: ReactElement) => {
  const SVG = renderToStaticMarkup(Component);
  return `data:image/svg+xml,${encodeURIComponent(SVG)}`;
};
