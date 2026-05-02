import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

import * as Log from '~/tools/logger';

const EXCLUDED_COPY_ENTRY_NAMES = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md']);
const EXCLUDED_COPY_ENTRY_PREFIXES = ['.'] as const;

const shouldSkipCopyEntry = (name: string): boolean => {
  return EXCLUDED_COPY_ENTRY_NAMES.has(name) || EXCLUDED_COPY_ENTRY_PREFIXES.some((prefix) => name.startsWith(prefix));
};

export const copyDir = async (src: string, dest: string): Promise<void> => {
  try {
    // コピー先ディレクトリが存在しない場合、作成する
    await mkdir(dest, { recursive: true });

    // コピー元のファイル・ディレクトリ一覧を取得する
    const files = await readdir(src, { withFileTypes: true });

    // 各エントリに対してコピー操作を実行
    for (const file of files) {
      if (shouldSkipCopyEntry(file.name)) {
        continue;
      }

      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isDirectory()) {
        // ディレクトリの場合、再帰的にコピー
        await copyDir(srcPath, destPath);
      } else {
        // ファイルの場合、単純にコピー
        await copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    Log.error(`Error while copying directory: ${error}`);
  }
};
