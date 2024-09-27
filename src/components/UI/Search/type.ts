import type { KeyboardEvent } from 'react';

import type { PostProps } from '@/types/source';

export type SearchProps = Pick<PostProps, 'title' | 'tags' | 'slug'>;
// biome-ignore lint/style/useNamingConvention:
export type onCloseDialogProps = () => void;
// biome-ignore lint/style/useNamingConvention:
export type onKeyupEventProps = KeyboardEvent<HTMLInputElement>;
// biome-ignore lint/style/useNamingConvention:
export type onKeyupProps = (e: onKeyupEventProps) => void;
