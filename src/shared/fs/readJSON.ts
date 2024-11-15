import { readFile } from 'node:fs/promises';

import { parseJSON } from '@/lib/parseJSON';

export async function readJSON<T>(file: string) {
  try {
    const fileData = await readFile(file, 'utf8');
    const parsedJSON = parseJSON<T>(fileData);

    return parsedJSON;
  } catch (e) {
    console.error(e);
    return null;
  }
}
