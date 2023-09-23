import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import * as Log from '@/lib/Log';

export const copyDir = async (srcDir: string, distDir: string) => {
  let results: string[] = [];
  let list: string[] = [];

  try {
    list = await readdir(srcDir);
  } catch (e) {
    Log.error(`Failed to read directory ${srcDir}: ${e.message}`);
    return results;
  }

  for (const file of list) {
    const src = path.join(srcDir, file);
    const dst = path.join(distDir, file);
    let fileStatus: Awaited<ReturnType<typeof stat>>;

    try {
      fileStatus = await stat(src);
    } catch (e) {
      Log.error(`Failed to get file status for ${src}: ${e.message}`);
      continue;
    }

    if (fileStatus.isDirectory()) {
      try {
        await mkdir(dst);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          Log.error(`Failed to create directory ${dst}: ${e.message}`);
        } else {
          Log.info(`Directory already exists: ${dst}`);
        }
      }
      results = results.concat(await copyDir(src, dst));
    } else {
      try {
        Log.info(`Copying file: ${dst}`);
        const readStream = createReadStream(src);
        const writeStream = createWriteStream(dst);
        readStream.pipe(writeStream);
      } catch (e) {
        Log.error(`Failed to copy file ${dst}: ${e.message}`);
      }
      results.push(src);
    }
  }

  return results;
};
