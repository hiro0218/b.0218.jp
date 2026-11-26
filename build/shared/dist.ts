import { readdirSync, readFileSync } from 'node:fs';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FILENAME_POSTS } from '@/constants';
import type { SearchDataPayload } from '@/lib/search';
import type {
  Activities,
  Page,
  Post,
  PostPopularityScores,
  PostSimilarityIndex,
  PostSummary,
  TagCategoryMap,
  TagCounts,
  TagIndex,
  TagSimilarityScores,
} from '@/types/source';
import * as Log from './logger';
import { BUILD_PATHS } from './paths';

/** キー(dist/<キー>.json のファイル名)だけを変えない。src が `~/dist/<キー>.json` をリテラルで import し、.github/workflows/pr-validation.yml も同じ名前の fixture を作るため */
type DistFiles = {
  'posts-list': Array<PostSummary>;
  pages: Array<Page>;
  tags: TagIndex;
  'tags-with-count': Array<TagCounts>;
  activities: Activities;
  search: SearchDataPayload;
  'tags-similarity': TagSimilarityScores;
  /** 内側のキーを並べ替えない。getPostPageData が Object.keys の順をそのまま関連記事の表示順にするため */
  'posts-similarity': PostSimilarityIndex;
  'posts-popular': PostPopularityScores;
  'tag-categories': TagCategoryMap;
};

type DistName = keyof DistFiles;

/** shape を検証しない。dist の shape は src の Source が SSG で検証するので、ここで二重にしない */
export async function readDist<K extends DistName>(name: K): Promise<DistFiles[K]> {
  const file = path.join(BUILD_PATHS.dist, `${name}.json`);

  try {
    return JSON.parse(await readFile(file, 'utf8')) as DistFiles[K];
  } catch (e) {
    throw new Error(`Failed to read JSON file: ${file}: ${e.message}`);
  }
}

/** ログはここで出し、呼び出し側に出させない。名前を引数とログの文言に 2 回書かせると、食い違いうるため */
export async function writeDist<K extends DistName>(name: K, data: DistFiles[K]): Promise<void> {
  // dist/ を作る役を writeDistPosts だけに任せない。buildPage が記事より先に pages.json を書くので、dist/ が無い状態(CI・Vercel)で始めると書けなくなるため
  await mkdir(BUILD_PATHS.dist, { recursive: true });
  await writeFile(path.join(BUILD_PATHS.dist, `${name}.json`), JSON.stringify(data));
  Log.info(`Write dist/${name}.json`);
}

/** date の降順で返す */
export function readDistPosts(): Array<Post> {
  const files = readdirSync(BUILD_PATHS.distPosts).filter((file) => file.endsWith('.json'));

  return files
    .map((file) => JSON.parse(readFileSync(path.join(BUILD_PATHS.distPosts, file), 'utf-8')) as Post)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** posts に無い JSON を残さない。消した記事や未来日にした記事が dist/posts に残ると、similarity の入力に混ざるため */
export async function writeDistPosts(posts: ReadonlyArray<Post>): Promise<void> {
  await mkdir(BUILD_PATHS.distPosts, { recursive: true });
  await Promise.all(
    posts.map((post) => writeFile(path.join(BUILD_PATHS.distPosts, `${post.slug}.json`), JSON.stringify(post))),
  );

  const slugs = new Set(posts.map((post) => post.slug));
  const staleFiles = (await readdir(BUILD_PATHS.distPosts)).filter(
    (file) => file.endsWith('.json') && !slugs.has(path.basename(file, '.json')),
  );
  await Promise.all(staleFiles.map((file) => unlink(path.join(BUILD_PATHS.distPosts, file))));
  Log.info(`Write dist/${FILENAME_POSTS}/ (${posts.length} files)`);
}
