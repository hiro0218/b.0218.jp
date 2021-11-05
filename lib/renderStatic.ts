import { cache } from '@emotion/css';
import createEmotionServer from '@emotion/server/create-instance';

export const renderStatic = async (html: string) => {
  const { extractCritical } = createEmotionServer(cache);
  const { ids, css } = extractCritical(html);

  return { html, ids, css };
};
