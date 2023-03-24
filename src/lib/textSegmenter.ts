export const textSegmenter = (text: string) => {
  const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });

  return Array.from(segmenterJa.segment(text))
    .map(({ segment }) => segment)
    .join('<wbr>');
};
