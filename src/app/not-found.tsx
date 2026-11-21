import { NotFoundContent } from '@/components/Page/NotFound/Content';
import { getRecentPosts } from '@/lib/post/list';

export default function NotFound() {
  return <NotFoundContent posts={getRecentPosts()} />;
}
