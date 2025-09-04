import { readFile } from 'node:fs/promises';

import { parseJSON } from '@/lib/parseJSON';

export async function readJSON<T>(file: string): Promise<T> {
  try {
    const fileData = await readFile(file, 'utf8');
    return parseJSON(fileData) as T;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to read JSON file: ${file}: ${e.message}`);
    }
    throw e;
  }
}
