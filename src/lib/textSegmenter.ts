export const textSegmenter = (text: string) => {
  const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });
  const segments = Array.from(segmenterJa.segment(text));
  const segmentedText = segments.map(({ segment }) => segment).join('<wbr>');

  return segmentedText;
};
