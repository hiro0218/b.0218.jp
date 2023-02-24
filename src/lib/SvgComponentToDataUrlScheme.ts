import { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

export const SvgComponentToDataUrlScheme = (Component: ReactElement) => {
  const SVG = ReactDOMServer.renderToString(Component);
  return 'data:image/svg+xml,' + encodeURIComponent(SVG);
};
