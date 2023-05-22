const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });

export const textSegmenter = (text: string) => {
  return [...segmenterJa.segment(text)].map(({ segment }) => segment).join('<wbr>');
};
