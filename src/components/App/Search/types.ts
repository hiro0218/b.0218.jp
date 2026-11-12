import type { Post } from '@/types/source';

export type PopularPost = Pick<Post, 'slug' | 'title'>;

/** 検索語が空のときは suggestions（最近の検索・よく読まれている記事）、あれば results（検索結果） */
export type SearchMode = 'suggestions' | 'results';

/** 一覧（listbox）の 1 行。並びの添字が、↑↓ で移るフォーカスの位置と一致する */
export type SearchOption =
  | { kind: 'recent'; id: string; query: string }
  | {
      kind: 'post';
      id: string;
      slug: string;
      title: string;
      /** タグだけに一致した行で、一致したタグ。一致をタイトルの太字だけで示さず、行末に出す。太字では理由が見えないため */
      matchedTag?: string;
    };
