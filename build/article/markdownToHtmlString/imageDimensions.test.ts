import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  readFileSync: vi.fn(),
  imageSize: vi.fn(),
}));

vi.mock('node:fs', () => ({
  readFileSync: mocks.readFileSync,
}));

vi.mock('image-size', () => ({
  imageSize: mocks.imageSize,
}));

const { readLocalImageDimensions } = await import('./imageDimensions');

const articleImagesRoot = path.resolve(process.cwd(), '_article', 'images');

let srcCounter = 0;
const uniqueSrc = (basename: string) => `/images/${++srcCounter}-${basename}`;

beforeEach(() => {
  mocks.readFileSync.mockReset();
  mocks.imageSize.mockReset();
});

describe('readLocalImageDimensions', () => {
  it('/images/ で始まらない src の場合、null を返しファイルを読まない', () => {
    expect(readLocalImageDimensions('/foo/bar.jpg')).toBeNull();
    expect(mocks.readFileSync).not.toHaveBeenCalled();
  });

  it('path traversal を含む src の場合、null を返しファイルを読まない', () => {
    expect(readLocalImageDimensions('/images/../../etc/passwd')).toBeNull();
    expect(mocks.readFileSync).not.toHaveBeenCalled();
  });

  it('null byte を含む src の場合、null を返しファイルを読まない', () => {
    expect(readLocalImageDimensions('/images/evil\0.jpg')).toBeNull();
    expect(mocks.readFileSync).not.toHaveBeenCalled();
  });

  it('不正な URL encoding の src の場合、null を返しファイルを読まない', () => {
    expect(readLocalImageDimensions('/images/%E0%A4%A.jpg')).toBeNull();
    expect(mocks.readFileSync).not.toHaveBeenCalled();
  });

  it('query string と fragment を除いた pathname で解決する', () => {
    const src = uniqueSrc('photo.jpg');
    mocks.readFileSync.mockReturnValue(Buffer.from('fake'));
    mocks.imageSize.mockReturnValue({ width: 200, height: 100, type: 'png' });

    expect(readLocalImageDimensions(`${src}?v=1#frag`)).toEqual({ width: 200, height: 100 });
    expect(mocks.readFileSync).toHaveBeenCalledWith(path.join(articleImagesRoot, src.slice('/images/'.length)));
  });

  it('percent-encoded path を decode して解決する', () => {
    const encoded = uniqueSrc('%E6%97%A5%E6%9C%AC.jpg');
    const decoded = decodeURIComponent(encoded.slice('/images/'.length));
    mocks.readFileSync.mockReturnValue(Buffer.from('fake'));
    mocks.imageSize.mockReturnValue({ width: 10, height: 10, type: 'png' });

    readLocalImageDimensions(encoded);
    expect(mocks.readFileSync).toHaveBeenCalledWith(path.join(articleImagesRoot, decoded));
  });

  it('ファイル読み込みに成功した場合、寸法を返す', () => {
    mocks.readFileSync.mockReturnValue(Buffer.from('fake'));
    mocks.imageSize.mockReturnValue({ width: 320, height: 180, type: 'png' });

    expect(readLocalImageDimensions(uniqueSrc('a.png'))).toEqual({ width: 320, height: 180 });
  });

  it('ファイル読み込みに失敗した場合、null を返す', () => {
    mocks.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    expect(readLocalImageDimensions(uniqueSrc('missing.png'))).toBeNull();
  });

  it('image-size が throw した場合、null を返す', () => {
    mocks.readFileSync.mockReturnValue(Buffer.from('not an image'));
    mocks.imageSize.mockImplementation(() => {
      throw new Error('unsupported format');
    });

    expect(readLocalImageDimensions(uniqueSrc('broken.bin'))).toBeNull();
  });

  it('同一 src を二度呼び出した場合、ファイルは一度しか読まない', () => {
    const src = uniqueSrc('cached.png');
    mocks.readFileSync.mockReturnValue(Buffer.from('fake'));
    mocks.imageSize.mockReturnValue({ width: 50, height: 50, type: 'png' });

    readLocalImageDimensions(src);
    readLocalImageDimensions(src);

    expect(mocks.readFileSync).toHaveBeenCalledTimes(1);
  });

  it('読み込み失敗の結果もキャッシュし、二度目は再読み込みしない', () => {
    const src = uniqueSrc('not-cached.png');
    mocks.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    expect(readLocalImageDimensions(src)).toBeNull();
    expect(readLocalImageDimensions(src)).toBeNull();
    expect(mocks.readFileSync).toHaveBeenCalledTimes(1);
  });
});
