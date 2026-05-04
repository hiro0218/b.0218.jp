import { Content } from '@/components/Page/NotFound/Content';
import { recentPosts } from '@/lib/post/list';

export default function NotFound() {
  return <Content posts={recentPosts} />;
}
