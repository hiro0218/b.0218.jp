import { readJsonSync } from 'fs-extra';
import { join } from 'path';

export const githubPinnedItems = () => {
  return readJsonSync(join(process.cwd(), `dist/githubPinnedItems.json`));
};
