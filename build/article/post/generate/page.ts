import { read as matterRead } from 'gray-matter';
import { FILENAME_PAGES } from '@/constants';
import type { Page } from '@/types/source';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import { getMarkdownFiles, getPath, getSlug, hasRequiredFrontmatter, isAgentFile } from './utils';

const PATH = getPath();

export async function buildPage() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(PATH.from);
  const pages: Page[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (isAgentFile(file)) {
      Log.info(`Skip agent file: ${file}`);
      continue;
    }

    try {
      // front matter を取得
      const page = matterRead(`${PATH.from}/${file}`);

      if (!hasRequiredFrontmatter(page.data)) {
        Log.info(`Skip file without required frontmatter: ${file}`);
        continue;
      }

      const { title, date, updated } = page.data;
      const content = await markdownToHtmlString(page.content);

      pages.push({
        title,
        slug: getSlug(file),
        date,
        ...(updated && { updated: new Date(updated).toISOString() }),
        content,
      });
    } catch (error) {
      Log.error(`Failed to parse frontmatter: ${file}`, error);
      continue;
    }
  }

  writeJSON(`${PATH.to}/${FILENAME_PAGES}.json`, pages).then(() => {
    Log.info(`Write dist/${FILENAME_PAGES}.json`);
  });
}
