import { writeFile } from 'node:fs/promises';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const writeJSON = async (path: string, json: any) => {
  const data = JSON.stringify(json);
  await writeFile(path, data);
};
