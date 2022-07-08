import { readJsonSync } from 'fs-extra';
import { join } from 'path';

const getPath = (filename: string) => {
  return join(process.cwd(), `dist/${filename}.json`);
};

export const githubPinnedItems = () => {
  const path = getPath('githubPinnedItems');

  return readJsonSync(path);
};
