import { Feed } from 'feed';
import { AUTHOR_NAME, SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants';
import { getDescriptionText } from '@/lib/domain/json-ld';
import { getPostBySlug } from '@/lib/source/post';
import { getOgpImage, getPermalink } from '@/lib/utils/url';
import type { Post, PostSummary } from '@/types/source';

const RSS_CONTENT_TYPE = 'application/rss+xml; charset=utf-8';
const RSS_FEED_LIMIT = 30;

type CreatePostsRssFeedOptions = {
  title?: string;
  description?: string;
  id?: string;
  link?: string;
  feedUrl: string;
  posts: PostSummary[];
  limit?: number;
};

function getFeedUpdatedDate(post: Post): Date {
  return new Date(post.updated ?? post.date);
}

function getPublicFeedPosts(posts: PostSummary[], limit: number): Post[] {
  const feedPosts: Post[] = [];

  for (const summary of posts) {
    if (feedPosts.length >= limit) {
      break;
    }

    const post = getPostBySlug(summary.slug);

    if (!post || post.noindex === true) {
      continue;
    }

    feedPosts.push(post);
  }

  return feedPosts;
}

export function createPostsRssFeed({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  id = SITE_URL,
  link = SITE_URL,
  feedUrl,
  posts,
  limit = RSS_FEED_LIMIT,
}: CreatePostsRssFeedOptions): string {
  const feedPosts = getPublicFeedPosts(posts, limit);
  const latestPost = feedPosts[0];
  const feed = new Feed({
    title,
    description,
    id,
    link,
    language: 'ja',
    image: SCREEN_IMAGE,
    copyright: `© ${AUTHOR_NAME}`,
    updated: latestPost ? getFeedUpdatedDate(latestPost) : new Date(0),
    feedLinks: {
      rss: feedUrl,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  for (const post of feedPosts) {
    const permalink = getPermalink(post.slug);

    feed.addItem({
      title: post.title,
      description: getDescriptionText(post.content),
      id: post.slug,
      link: permalink,
      guid: permalink,
      date: new Date(post.date),
      image: getOgpImage(post.slug),
    });
  }

  return feed.rss2();
}

export function createRssResponse(feedXml: string): Response {
  return new Response(feedXml, {
    headers: {
      'Content-Type': RSS_CONTENT_TYPE,
    },
  });
}
