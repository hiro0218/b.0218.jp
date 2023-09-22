import { readFile } from 'node:fs/promises';

import { parseJSON } from '@/lib/parseJSON';

export async function readJSON<T>(file: string) {
  const fileData = await readFile(file, 'utf8');

  let parsedJSON: T;

  try {
    parsedJSON = parseJSON<T>(fileData);
  } catch {
    return null;
  }

  return parsedJSON;
}
