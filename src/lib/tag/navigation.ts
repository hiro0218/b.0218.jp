import { SITE_URL } from '@/constants';
import { tagUrlPath } from './url';

/** Tag 表示名からタグページのパスを作る。 */
export function tagPath(name: string): `/tags/${string}` {
  return `/tags/${tagUrlPath(name)}`;
}

/** Tag 表示名からタグページの絶対 URL を作る。 */
export function tagPermalink(name: string): string {
  return `${SITE_URL}${tagPath(name)}`;
}

/** Tag 表示名からタグ RSS のパスを作る。 */
export function tagFeedPath(name: string): `/tags/${string}/feed.xml` {
  return `${tagPath(name)}/feed.xml`;
}

/** Tag 表示名からタグ RSS の絶対 URL を作る。 */
export function tagFeedPermalink(name: string): string {
  return `${SITE_URL}${tagFeedPath(name)}`;
}
