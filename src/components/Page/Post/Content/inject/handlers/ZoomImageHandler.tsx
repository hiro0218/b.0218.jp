import type { HandlerFunction } from '../types';
import ZoomImage from './ZoomImage';

export const handleZoomImage: HandlerFunction = (domNode) => {
  if (domNode.tagName === 'img') {
    const attribs = domNode.attribs || {};
    const { src, alt = '', ...rest } = attribs;

    if (!src) {
      return undefined;
    }

    return <ZoomImage src={src} alt={alt} {...rest} />;
  }

  return undefined;
};
