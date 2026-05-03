import type { ReactNode } from 'react';

export function Renderer({ content }: { content: ReactNode }) {
  return <div className="post-content">{content}</div>;
}
