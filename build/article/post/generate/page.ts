import { readFileSync } from 'node:fs';
import type { Page } from '@/types/source';
import { writeDist } from '~/build/shared/dist';
import * as Log from '~/build/shared/logger';
import { createMarkdownToPostHtmlString } from '../../markdownToHtmlString';
import { isValidFrontmatter, parseFrontmatter, tryToIso } from './raw';
import { getMarkdownFiles, getPath, getSlug, isAgentFile } from './utils';

const PATH = getPath();

export async function buildPage(): Promise<void> {
  const files = await getMarkdownFiles(PATH.from);
  const pages: Page[] = [];
  const markdownToPostHtml = createMarkdownToPostHtmlString();

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
      const content = await markdownToPostHtml(markdown);

      const updatedIso = tryToIso(updated);
      pages.push({
        title,
        slug: getSlug(file),
        date: tryToIso(date) ?? '',
        ...(updatedIso && { updated: updatedIso }),
        content,
      });
    } catch (error) {
      Log.error(`Failed to process file: ${file}`, error);
      continue;
    }
  }

  await writeDist('pages', pages);
  Log.info('Write dist/pages.json');
}
