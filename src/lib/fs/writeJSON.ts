import { writeFile } from 'node:fs/promises';

import stringify from 'fast-json-stable-stringify';

export const writeJSON = async (path: string, json: unknown) => {
  const data = stringify(json);
  await writeFile(path, data);
};
