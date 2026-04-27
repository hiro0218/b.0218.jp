import { readFileSync } from 'node:fs';
import path from 'node:path';

export type LazyLoaderConfig<T> = {
  baseDir: string;
  validate: (value: unknown) => value is T;
  label: string;
};

export type LazyLoader<T> = {
  load(filename: string): T | null;
};

/**
 * baseDir 配下の JSON を filename で逐次読み込み、ファイル単位でキャッシュする。
 * 不在 (ENOENT) の場合は null を返してネガティブキャッシュにも記録する。
 * 内容の検証失敗は throw して不正な dist を見逃さない。
 * baseDir 外を指す filename は path traversal として throw する。
 */
export function createLazyLoader<T>(config: LazyLoaderConfig<T>): LazyLoader<T> {
  const cache = new Map<string, T | null>();
  const baseResolved = path.resolve(config.baseDir);

  return {
    load(filename) {
      if (cache.has(filename)) {
        return cache.get(filename) as T | null;
      }

      const fullPath = path.resolve(baseResolved, filename);
      const relative = path.relative(baseResolved, fullPath);
      if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error(`[source/${config.label}] Filename escapes baseDir: ${filename}`);
      }

      let raw: string;
      try {
        raw = readFileSync(fullPath, 'utf-8');
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          cache.set(filename, null);
          return null;
        }
        throw error;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`[source/${config.label}] JSON parse error in ${filename}: ${reason}`);
      }
      if (!config.validate(parsed)) {
        throw new Error(`[source/${config.label}] Invalid data in ${filename}`);
      }

      cache.set(filename, parsed);
      return parsed;
    },
  };
}
