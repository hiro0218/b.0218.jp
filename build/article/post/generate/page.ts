import { read as matterRead } from 'gray-matter';
import { FILENAME_PAGES } from '@/constant';
import type { Page } from '@/types/source';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

export async function buildPage() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(PATH.from);
  const pages: Page[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // front matter を取得
    const page = matterRead(`${PATH.from}/${file}`);
    const { title, date, updated } = page.data as Page;
    const content = await markdownToHtmlString(page.content);

    pages.push({
      title,
      slug: getSlug(file),
      date,
      ...(updated && { updated: new Date(updated).toISOString() }),
      content,
    });
  }

  writeJSON(`${PATH.to}/${FILENAME_PAGES}.json`, pages).then(() => {
    Log.info(`Write dist/${FILENAME_PAGES}.json`);
  });
}
