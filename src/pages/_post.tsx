import { defineComponent, useContext, useMeta } from '@nuxtjs/composition-api';

import LayoutHeader from '~/components/LayoutHeader';
import PostAds from '~/components/PostAds';
import PostData from '~/components/PostData';
import PostMeta from '~/components/PostMeta';
import PostPager from '~/components/PostPager';
import PostShare from '~/components/PostShare';
import CONSTANT from '~/constant';
import { Post } from '~/types/source';
import { getBlogPostingStructured, getBreadcrumbStructured } from '~/utils/json-ld';

const getOgImagePath = (slug: string): string => {
  if (!slug) return '';

  const filename = slug.replace('.html', '');
  return slug ? `https://hiro0218.github.io/blog/images/ogp/${filename}.png` : CONSTANT.AUTHOR_ICON;
};

export default defineComponent({
  name: 'Post',
  setup(_, { root }) {
    const { params } = useContext();

    // nuxt generate & nuxt dev
    if (process.static && process.server) {
      // generate時はhtmlが含まれていないため付与する
      if (!params.value.post.includes('.html')) {
        params.value.post += '.html';
      }
    }

    // パラメータからヘッダー情報を取得
    // @ts-ignore
    const postData: Post = root.context.$source.posts.find((post: { path: string }) => {
      return post.path === params.value.post;
    });

    if (!postData || Object.keys(postData).length === 0) {
      // @ts-ignore
      root.error({ statusCode: 404, message: 'Page not found' });
      return;
    }

    const post: Post = {
      ...postData,
      // @ts-ignore
      content: root.context.$filteredPost(postData.content),
    };

    useMeta({
      title: post.title,
      titleTemplate: undefined,
      meta: [
        { hid: 'description', name: 'description', content: post.excerpt },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: `${CONSTANT.SITE_URL}${post.path}` },
        { hid: 'og:title', property: 'og:title', content: post.title },
        { hid: 'og:description', property: 'og:description', content: post.excerpt },
        {
          hid: 'og:image',
          property: 'og:image',
          content: getOgImagePath(post.path),
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'og:updated_time', property: 'og:updated_time', content: post.updated },
        { hid: 'article:published_time', property: 'article:published_time', content: post.date },
        { hid: 'article:modified_time', property: 'article:modified_time', content: post.updated },
      ],
      link: [{ rel: 'canonical', href: `${CONSTANT.SITE_URL}${post.path}` }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(getBlogPostingStructured(post)),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(getBreadcrumbStructured(post)),
        },
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          async: true,
          // @ts-ignore
          skip: root.context.isDev,
        },
        {
          innerHTML: '(adsbygoogle = window.adsbygoogle || []).push({});',
          // @ts-ignore
          skip: root.context.isDev,
        },
      ],
    });

    return {
      post,
    };
  },
  head() {
    return {};
  },
  render() {
    return (
      <div class="post">
        {this.post && (
          <div>
            <article class="post__article">
              <LayoutHeader heading={this.post.title}>
                <PostMeta
                  date={this.post.date}
                  updated={this.post.updated}
                  postCategory={this.post.categories}
                  postTag={this.post.tags}
                />
              </LayoutHeader>
              <PostAds />
              <PostData content={this.post.content} />
            </article>
            <div class="post__share">
              <client-only>
                <PostShare postTitle={this.post.title} />
              </client-only>
            </div>
            <div class="post__pager">
              <PostPager next={this.post.next} prev={this.post.prev} />
            </div>
          </div>
        )}
      </div>
    );
  },
});
