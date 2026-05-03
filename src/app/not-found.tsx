import { recentPosts } from '@/app/_lib/cachedRecentPosts';
import { Content } from '@/components/Page/NotFound/Content';

export default function NotFound() {
  return <Content posts={recentPosts} />;
}
