import { fdir } from 'fdir';

const isMarkdown = (file: string) => file.endsWith('.md');

export const getSlug = (file: string) => file.replace('.md', '');

export const getPath = () => {
  return {
    from: `${process.cwd()}/_article`,
    to: `${process.cwd()}/dist`,
  } as const;
};

export const getMarkdownFiles = async (directory: string, maxDepth = 0) => {
  // md ファイル一覧を取得
  const files = await new fdir()
    .withMaxDepth(maxDepth)
    .filter((path) => isMarkdown(path))
    .crawl(directory)
    .withPromise();

  return files;
};

const agentFiles = ['CLAUDE.md', 'AGENTS.md'] as const;

export const isAgentFile = (filename: string): boolean => {
  return agentFiles.some((pattern) => filename.toUpperCase() === pattern.toUpperCase());
};

/**
 * 必須フロントマターフィールドの存在を検証
 */
// biome-ignore lint/suspicious/noExplicitAny: gray-matter returns any type for frontmatter data
export const hasRequiredFrontmatter = (data: any): boolean => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.title === 'string' &&
    data.title.trim() !== '' &&
    (typeof data.date === 'string' || data.date instanceof Date) &&
    (typeof data.date === 'string' ? data.date.trim() !== '' : true)
  );
};
