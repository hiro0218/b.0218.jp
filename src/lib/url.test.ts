import { SITE_URL } from '@/constant';

import { getOgpImage, getPermalink } from './url';

describe('getPermalink', () => {
  it('should return the permalink for a given slug', () => {
    const slug = 'example-post';
    const expectedOutput = `${SITE_URL}/${slug}.html`;
    expect(getPermalink(slug)).toBe(expectedOutput);
  });
});

describe('getOgpImage', () => {
  it('should return the OGP image URL for a given slug', () => {
    const slug = 'example-post';
    const expectedOutput = `${SITE_URL}/images/ogp/${slug}.png`;
    expect(getOgpImage(slug)).toBe(expectedOutput);
  });
});
