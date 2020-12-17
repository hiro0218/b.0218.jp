// Terms
export interface TermsPostLits {
  title: string;
  path: string;
  excerpt: string;
  date: string;
}

export interface Terms {
  name: string;
  slug: string;
  path?: string;
  count: number;
  posts: Array<TermsPostLits>;
}

// Post
export interface TermsPostList {
  name: string;
  slug: string;
  path: string;
}

export interface NextPrevPost {
  title: string;
  path: string;
}

export interface Post {
  date: string;
  updated: string;
  path: string;
  permalink: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  categories: Array<TermsPostList>;
  tags: Array<TermsPostList>;
  next: NextPrevPost;
  prev: NextPrevPost;
}
