import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import * as Log from '@/lib/Log';

const TARGET_DIRECTORY = path.join(process.cwd(), 'public/images/ogp');

async function convertToWebp(file: string) {
  const inputFile = path.join(TARGET_DIRECTORY, file);
  const outputFile = path.join(TARGET_DIRECTORY, `${path.basename(file, '.png')}.webp`);

  try {
    await sharp(inputFile).toFormat('webp').toFile(outputFile);
    await fs.unlink(inputFile);
  } catch (err) {
    Log.error(err.message);
  }
}

async function main() {
  const files = await fs.readdir(TARGET_DIRECTORY);
  const pngFiles = files.filter((file) => path.extname(file) === '.png');

  await Promise.all(pngFiles.map(convertToWebp));
}

main().catch((err) => Log.error(err.message));
