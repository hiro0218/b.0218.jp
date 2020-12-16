import '@nuxt/types';

declare module '@nuxt/types' {
  interface Context {
    $source: {
      pages: any,
      posts: any,
      recentPosts: any,
      archives: any,
      categories: any,
      categoriesPosts: any,
      tagsPosts: any,
      updatedPosts: any,
    };
    $filteredPost(content: string): string;
    $Mokuji: any;
  }
}
