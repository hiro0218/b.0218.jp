import { SITE } from '@/constant';

import { getOgpImage, getPermalink } from './url';

describe('getPermalink', () => {
  it('should return the permalink for a given slug', () => {
    const slug = 'example-post';
    const expectedOutput = `${SITE.URL}/${slug}.html`;
    expect(getPermalink(slug)).toBe(expectedOutput);
  });
});

describe('getOgpImage', () => {
  it('should return the OGP image URL for a given slug', () => {
    const slug = 'example-post';
    const expectedOutput = `${SITE.URL}/images/ogp/${slug}.webp`;
    expect(getOgpImage(slug)).toBe(expectedOutput);
  });
});