import escapeHTML from '@/lib/escapeHTML';

const HIGHLIGHT_TAG_NAME = 'mark';

const markEscapedHTML = (text: string, markTexts: string[]) => {
  const escapedText = escapeHTML(text);
  const regEx = new RegExp(markTexts.join('|'), 'gi');
  return escapedText.replace(regEx, `<${HIGHLIGHT_TAG_NAME}>$&</${HIGHLIGHT_TAG_NAME}>`);
};

export const getMarkedTitles = (suggestions: { title: string }[], keyword: string) => {
  const splitKeyword = keyword.split(' ').filter((word) => word.trim() !== '');
  return suggestions.map(({ title }) => markEscapedHTML(title, splitKeyword));
};
