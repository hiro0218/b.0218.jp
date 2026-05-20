import { copyFile, mkdir, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

const EXCLUDED_COPY_ENTRY_NAMES = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md']);
const EXCLUDED_COPY_ENTRY_PREFIXES = ['.'] as const;

const shouldSkipCopyEntry = (name: string): boolean => {
  return EXCLUDED_COPY_ENTRY_NAMES.has(name) || EXCLUDED_COPY_ENTRY_PREFIXES.some((prefix) => name.startsWith(prefix));
};

export const copyDir = async (src: string, dest: string): Promise<void> => {
  const sourceRoot = await realpath(src);
  await copyDirInternal(sourceRoot, sourceRoot, dest);
};

const isInsideDirectory = (root: string, target: string): boolean => {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const copyDirInternal = async (sourceRoot: string, srcDir: string, destDir: string): Promise<void> => {
  await mkdir(destDir, { recursive: true });

  const files = await readdir(srcDir, { withFileTypes: true });

  for (const file of files) {
    if (shouldSkipCopyEntry(file.name)) {
      continue;
    }

    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isSymbolicLink()) {
      throw new Error(`Refuse to copy symbolic link: ${srcPath}`);
    }

    const realSrcPath = await realpath(srcPath);
    if (!isInsideDirectory(sourceRoot, realSrcPath)) {
      throw new Error(`Refuse to copy entry outside source root: ${srcPath}`);
    }

    if (file.isDirectory()) {
      await copyDirInternal(sourceRoot, realSrcPath, destPath);
      continue;
    }

    if (!file.isFile()) {
      throw new Error(`Unsupported copy entry type: ${srcPath}`);
    }

    await copyFile(realSrcPath, destPath);
  }
};
