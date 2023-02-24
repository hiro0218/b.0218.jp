import { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

export const SvgComponentToBase64 = (Component: ReactElement) => {
  const SVG = ReactDOMServer.renderToString(Component);
  return 'data:image/svg+xml;base64,' + Buffer.from(SVG).toString('base64');
};
