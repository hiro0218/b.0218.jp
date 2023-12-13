import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import * as Log from '@/lib/Log';

const TARGET_DIRECTORY = path.join(process.cwd(), 'public/images/ogp');
const CONCURRENCY_LIMIT = 10;

async function convertToWebp(file: string, index: number, total: number) {
  const inputFile = path.join(TARGET_DIRECTORY, file);
  const outputFile = path.join(TARGET_DIRECTORY, `${path.basename(file, '.png')}.webp`);

  try {
    await sharp(inputFile).toFormat('webp').toFile(outputFile);
    await fs.unlink(inputFile);
    const processed = index + 1;
    if (processed === 1 || processed % 100 === 0 || processed === total) {
      Log.info('Convert PNG to WebP', `(${processed}/${total})`);
    }
  } catch (err) {
    Log.error(err.message);
  }
}

async function main() {
  const files = await fs.readdir(TARGET_DIRECTORY);
  const pngFiles = files.filter((file) => path.extname(file) === '.png');
  const total = pngFiles.length;

  for (let i = 0; i < pngFiles.length; i += CONCURRENCY_LIMIT) {
    const batch = pngFiles.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(batch.map((file, index) => convertToWebp(file, i + index, total)));
  }
}

main();
