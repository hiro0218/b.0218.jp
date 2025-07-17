import { SITE_URL } from '@/constant';

import { convertPostSlugToPath, getOgpImage, getPermalink } from './url';

describe('convertPostSlugToPath', () => {
  it('should return the path for a given slug', () => {
    const slug = 'example-post';
    const expectedOutput = `/${slug}.html`;
    expect(convertPostSlugToPath(slug)).toBe(expectedOutput);
  });
});

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
    const expectedOutput = `${SITE_URL}/images/ogp/${slug}.jpg`;
    expect(getOgpImage(slug)).toBe(expectedOutput);
  });
});
