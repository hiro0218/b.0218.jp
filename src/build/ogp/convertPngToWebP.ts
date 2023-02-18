import { readdirSync } from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import sharp from 'sharp';

import * as Log from '@/lib/Log';

const TARGET_DIRECTORY = path.join(process.cwd(), 'public/images/ogp');

const files = readdirSync(TARGET_DIRECTORY);

files.forEach((file) => {
  if (path.extname(file) === '.png') {
    const inputFile = path.join(TARGET_DIRECTORY, file);
    const outputFile = path.join(TARGET_DIRECTORY, path.basename(file, '.png') + '.webp');

    sharp(inputFile)
      .toFormat('webp')
      .toFile(outputFile, (err) => {
        if (err) {
          Log.error(err.message);
        }

        rimraf.sync(inputFile);
      });
  }
});
