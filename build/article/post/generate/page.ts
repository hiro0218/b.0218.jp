import { readFileSync } from 'node:fs';
import { FILENAME_PAGES } from '@/constants';
import { isValidFrontmatter, parseFrontmatter } from '@/lib/post/raw';
import type { Page } from '@/types/source';
import { writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';
import markdownToHtmlString from '../../markdownToHtmlString';
import { getMarkdownFiles, getPath, getSlug, isAgentFile } from './utils';

const PATH = getPath();

export async function buildPage() {
  const files = await getMarkdownFiles(PATH.from);
  const pages: Page[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (isAgentFile(file)) {
      Log.info(`Skip agent file: ${file}`);
      continue;
    }

    try {
      const source = readFileSync(`${PATH.from}/${file}`, 'utf-8');
      const { frontmatter, markdown } = parseFrontmatter(source);

      if (!isValidFrontmatter(frontmatter)) {
        Log.info(`Skip file without required frontmatter: ${file}`);
        continue;
      }

      const { title, date, updated } = frontmatter;
      const content = await markdownToHtmlString(markdown);

      pages.push({
        title,
        slug: getSlug(file),
        date: date instanceof Date ? date.toISOString() : date,
        ...(updated && { updated: new Date(updated).toISOString() }),
        content,
      });
    } catch (error) {
      Log.error(`Failed to process file: ${file}`, error);
      continue;
    }
  }

  writeJSON(`${PATH.to}/${FILENAME_PAGES}.json`, pages).then(() => {
    Log.info(`Write dist/${FILENAME_PAGES}.json`);
  });
}
