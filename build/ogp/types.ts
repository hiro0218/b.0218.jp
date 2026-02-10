export type Post = { title: string; slug: string };

export type WorkerMessage =
  | { type: 'completed'; index?: number }
  | { type: 'error'; slug: string; error: string }
  | { type: 'summary'; failed: string[] };

export type WorkerTaskMessage = { type: 'posts'; posts: Post[] };
