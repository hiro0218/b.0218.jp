import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type StoryEntry = {
  id: string;
  type: 'story' | 'docs';
  tags?: string[];
};

type StoryIndex = {
  v: number;
  entries: Record<string, StoryEntry>;
};

const STORYBOOK_INDEX_PATH = join(process.cwd(), 'storybook-static', 'index.json');

const INCLUDE_PREFIXES: readonly string[] = ['ui-'];

const EXCLUDED_TAGS: readonly string[] = ['!manifest', '!vrt'];

export function loadStoryIds(): string[] {
  if (!existsSync(STORYBOOK_INDEX_PATH)) {
    throw new Error(
      `Storybook index not found at ${STORYBOOK_INDEX_PATH}.\n` +
        `Run 'npm run vrt:build' first to generate storybook-static/.`,
    );
  }
  const raw = readFileSync(STORYBOOK_INDEX_PATH, 'utf8');
  const index = JSON.parse(raw) as StoryIndex;

  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story' && isIncluded(entry.id) && !hasExcludedTag(entry.tags))
    .map((entry) => entry.id);
}

function isIncluded(id: string): boolean {
  if (INCLUDE_PREFIXES.length === 0) return true;
  return INCLUDE_PREFIXES.some((prefix) => id.startsWith(prefix));
}

function hasExcludedTag(tags: string[] | undefined): boolean {
  if (!tags) return false;
  return tags.some((tag) => EXCLUDED_TAGS.includes(tag));
}
