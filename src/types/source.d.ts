// Pages
export interface Pages {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
}

// Terms
export interface TermsPostList {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
}

// Post
export interface TermsPostList {
  name: string;
}

export interface Post {
  date: string;
  updated: string;
  note: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  tags: Array<string>;
  readingTime: string;
}

export interface GithubPinnedItems {
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  homepageUrl: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  languages: { color: string; name: string };
}
