import type { PostProps } from '@/types/source';

export type SearchProps = Pick<PostProps, 'title' | 'tags' | 'slug'>;
