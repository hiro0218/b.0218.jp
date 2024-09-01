import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const svgComponentToDataUrlScheme = (Component: ReactElement) => {
  const SVG = renderToStaticMarkup(Component);
  return `data:image/svg+xml,${encodeURIComponent(SVG)}`;
};
