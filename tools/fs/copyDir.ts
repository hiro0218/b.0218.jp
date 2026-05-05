import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const EXCLUDED_COPY_ENTRY_NAMES = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md']);
const EXCLUDED_COPY_ENTRY_PREFIXES = ['.'] as const;

const shouldSkipCopyEntry = (name: string): boolean => {
  return EXCLUDED_COPY_ENTRY_NAMES.has(name) || EXCLUDED_COPY_ENTRY_PREFIXES.some((prefix) => name.startsWith(prefix));
};

export const copyDir = async (src: string, dest: string): Promise<void> => {
  await mkdir(dest, { recursive: true });

  const files = await readdir(src, { withFileTypes: true });

  for (const file of files) {
    if (shouldSkipCopyEntry(file.name)) {
      continue;
    }

    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
};
