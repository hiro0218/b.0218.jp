import { FILENAME_PAGES } from '@/constant';
import * as Log from '@/shared/Log';
import { writeJSON } from '@/shared/fs';
import type { PageProps } from '@/types/source';
import { read as matterRead } from 'gray-matter';
import markdownToHtmlString from '../../markdownToHtmlString';
import { getMarkdownFiles, getPath, getSlug } from './utils';

const PATH = getPath();

export async function buildPage() {
  // md ファイル一覧を取得
  const files = await getMarkdownFiles(PATH.from);
  const pages: PageProps[] = [];

  // 記事一覧
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // front matter を取得
    const page = matterRead(`${PATH.from}/${file}`);
    const { title, date, updated } = page.data as PageProps;
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
