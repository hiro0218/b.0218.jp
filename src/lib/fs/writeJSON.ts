import { writeFile } from 'node:fs/promises';

export const writeJSON = async (path: string, json: unknown) => {
  const data = JSON.stringify(json);
  await writeFile(path, data);
};
