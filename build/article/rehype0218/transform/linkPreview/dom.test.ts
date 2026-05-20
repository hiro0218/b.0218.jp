import { getMeta } from './dom';

const metaEntries = (meta: HTMLMetaElement[] | null) => {
  return (meta ?? []).map((element) => [
    element.getAttribute('property') ?? element.getAttribute('name'),
    element.getAttribute('content'),
  ]);
};

describe('getMeta', () => {
  it('content 属性が property 属性より前にある meta を抽出する', () => {
    const meta = getMeta('<head><meta content="Example" property="og:title"></head>');

    expect(metaEntries(meta)).toEqual([['og:title', 'Example']]);
  });

  it('Twitter Card の meta を既存の OGP 抽出用 shape に正規化する', () => {
    const meta = getMeta(`
      <head>
        <meta name="twitter:title" content="Twitter title">
        <meta name="twitter:description" content="Twitter description">
        <meta name="twitter:image" content="https://example.com/image.png">
        <meta name="twitter:card" content="summary_large_image">
      </head>
    `);

    expect(metaEntries(meta)).toEqual([
      ['og:title', 'Twitter title'],
      ['description', 'Twitter description'],
      ['og:image', 'https://example.com/image.png'],
      ['twitter:card', 'summary_large_image'],
    ]);
  });

  it('OGP title がない場合は title 要素を fallback として使う', () => {
    const meta = getMeta('<head><title>Fallback title</title><meta name="description" content="Description"></head>');

    expect(metaEntries(meta)).toEqual([
      ['description', 'Description'],
      ['og:title', 'Fallback title'],
    ]);
  });

  it('対象 meta と title がない場合は null を返す', () => {
    expect(getMeta('<head><meta name="viewport" content="width=device-width"></head>')).toBeNull();
  });
});
