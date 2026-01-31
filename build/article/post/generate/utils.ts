import path from 'node:path';
import { fdir } from 'fdir';
import { BUILD_PATHS } from '~/build/shared/paths';

const isMarkdown = (file: string) => file.endsWith('.md');

export const getSlug = (file: string) => {
  const filename = path.basename(file);
  return filename.replace('.md', '');
};

export const getPath = () => {
  return {
    from: BUILD_PATHS.article,
    to: BUILD_PATHS.dist,
  } as const;
};

export const getMarkdownFiles = async (directory: string, maxDepth = 0) => {
  // md ファイル一覧を取得
  const files = await new fdir()
    .withMaxDepth(maxDepth)
    .withRelativePaths()
    .filter((path) => isMarkdown(path))
    .crawl(directory)
    .withPromise();

  return files;
};

const agentFiles = ['CLAUDE.md', 'AGENTS.md'] as const;

export const isAgentFile = (filename: string): boolean => {
  const upperFilename = filename.toUpperCase();
  return agentFiles.some((pattern) => upperFilename === pattern.toUpperCase());
};

/**
 * 必須フロントマターフィールドの存在を検証
 */
// biome-ignore lint/suspicious/noExplicitAny: gray-matter returns any type for frontmatter data
export const hasRequiredFrontmatter = (data: any): boolean => {
  return !!(data?.title?.trim() && data?.date);
};
