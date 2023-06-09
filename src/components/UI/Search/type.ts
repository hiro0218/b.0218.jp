import { type KeyboardEvent } from 'react';

import type { PostProps } from '@/types/source';

export type SearchProps = Pick<PostProps, 'title' | 'tags' | 'slug'>;
export type onCloseDialogProps = () => void;
export type onKeyupEventProps = KeyboardEvent<HTMLInputElement>;
export type onKeyupProps = (e: onKeyupEventProps) => void;
