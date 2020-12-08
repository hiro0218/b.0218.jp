// Terms
export interface Terms {
  name: string;
  slug: string;
  count: number;
  posts: Array<{
    title: string;
    path: string;
    excerpt: string;
    date: string;
  }>;
}

export interface TermsPostList {
  name: string;
  slug: string;
  path: string;
}

export interface NextPrevPost {
  title: string;
  path: string;
}

// Post
export interface Post {
  date: string;
  updated: string;
  slug: string;
  path: string; // TODO
  link: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  categories: Array<TermsPostList>;
  tags: Array<TermsPostList>;
  next: NextPrevPost;
  prev: NextPrevPost;
}
