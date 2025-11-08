import { readFile } from 'node:fs/promises';

import { safeJsonParse } from '@/lib/utils/json';

export async function readJSON<T>(file: string): Promise<T> {
  try {
    const fileData = await readFile(file, 'utf8');
    const parsed = safeJsonParse<T>(fileData);

    if (parsed === null) {
      throw new Error(`Failed to parse JSON file: ${file}`);
    }

    return parsed;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to read JSON file: ${file}: ${e.message}`);
    }
    throw e;
  }
}
