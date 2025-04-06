import { fdir } from 'fdir';

const isMarkdown = (file: string) => file.endsWith('.md');

export const getSlug = (file: string) => file.replace('.md', '');

export const getPath = () => {
  return {
    from: `${process.cwd()}/_article`,
    to: `${process.cwd()}/dist`,
  } as const;
};

export const getMarkdownFiles = async (directory: string) => {
  // md ファイル一覧を取得
  const files = await new fdir()
    .withMaxDepth(0)
    .filter((path) => isMarkdown(path))
    .crawl(directory)
    .withPromise();

  return files;
};
