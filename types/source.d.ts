// Archive
export interface Archives {
  title: string;
  date: string;
  updated?: string;
  path: string;
  excerpt?: string;
}

// Pages
export interface Pages {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
}

// Terms
export interface TermsPostLits {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
}

export interface Terms {
  name: string;
  count: number;
  posts: Array<TermsPostLits>;
}

// Post
export interface TermsPostList {
  name: string;
}

export interface NextPrevPost {
  title: string;
  slug: string;
}

export interface Post {
  date: string;
  updated: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  categories: Array<string>;
  tags: Array<string>;
  next: NextPrevPost;
  prev: NextPrevPost;
}
