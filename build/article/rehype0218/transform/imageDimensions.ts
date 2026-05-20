import * as fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import { BUILD_PATHS } from '../../../shared/paths';

export type ImageDimensions = {
  width: number;
  height: number;
};

const dimensionsCache = new Map<string, ImageDimensions | null>();

const readImageDimensions = (buffer: Buffer): ImageDimensions | null => {
  try {
    const dimensions = imageSize(buffer);
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch {
    return null;
  }
};

const resolveArticleImagePath = (src: string): string | null => {
  const [pathname] = src.split(/[?#]/);
  if (!pathname.startsWith('/images/')) return null;

  let relativePath: string;
  try {
    relativePath = decodeURIComponent(pathname.slice('/images/'.length));
  } catch {
    return null;
  }

  if (!relativePath || relativePath.includes('\0')) return null;

  const imageRoot = path.resolve(BUILD_PATHS.articleImages);
  const imagePath = path.resolve(imageRoot, relativePath);
  const relativeToRoot = path.relative(imageRoot, imagePath);
  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return null;

  return imagePath;
};

export const readLocalImageDimensions = (src: string): ImageDimensions | null => {
  const imagePath = resolveArticleImagePath(src);
  if (!imagePath) return null;

  const cached = dimensionsCache.get(imagePath);
  if (cached !== undefined) return cached;

  try {
    const dimensions = readImageDimensions(fs.readFileSync(imagePath));
    dimensionsCache.set(imagePath, dimensions);
    return dimensions;
  } catch {
    dimensionsCache.set(imagePath, null);
    return null;
  }
};
