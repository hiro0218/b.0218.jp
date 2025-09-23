import type { ReactNode } from 'react';

type PostContentRendererProps = {
  content: ReactNode;
};

export function PostContentRenderer({ content }: PostContentRendererProps) {
  return <div className="post-content">{content}</div>;
}
