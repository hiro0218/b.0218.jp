const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });

export const textSegmenter = (text: string) => {
  return Array.from(segmenterJa.segment(text))
    .map(({ segment }) => segment)
    .join('<wbr>');
};
