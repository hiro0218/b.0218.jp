import { constant, route } from './settings';
const routeData = async () => await route.getData();

module.exports = {
  env: {
    AUTHOR: constant.AUTHOR,
    AUTHOR_ICON: constant.AUTHOR_ICON,
    SITE_NAME: constant.SITE_NAME,
    SITE_URL: constant.SITE_URL,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.SITE_NAME,
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
    },
    titleTemplate: titleChunk => {
      return titleChunk ? `${titleChunk} - ${process.env.SITE_NAME}` : process.env.SITE_NAME;
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: constant.SITE_DESCRIPTION },
      { hid: 'og:site_name', property: 'og:site_name', content: constant.SITE_NAME },
      { hid: 'og:locale', property: 'og:locale', content: 'ja_JP' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: constant.SITE_URL },
      { hid: 'og:title', property: 'og:title', content: constant.SITE_NAME },
      { hid: 'og:description', property: 'og:description', content: constant.SITE_DESCRIPTION },
      { hid: 'og:image', property: 'og:image', content: process.env.AUTHOR_ICON },
      { name: 'twitter:site', content: '@hiro0218' },
      { name: 'twitter:creator', content: '@hiro0218' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'fb:app_id', content: '1042526022490602' },
      { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
    ],
    link: [
      { rel: 'dns-prefetch', href: '//user-images.githubusercontent.com' },
      { rel: 'dns-prefetch', href: '//i.imgur.com' },
      { rel: 'dns-prefetch', href: '//images-fe.ssl-images-amazon.com' },
      { rel: 'dns-prefetch', href: '//www.googletagservices.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'dns-prefetch', href: '//adservice.google.com' },
      { rel: 'dns-prefetch', href: '//cdn.polyfill.io' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', href: 'https://content.b.0218.jp/feed/' },
      { itemprop: 'author', href: 'https://b.0218.jp/about/' },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/fonts/NotoSansCJKjp-DemiLight.woff2',
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'crossorigin',
        type: 'font/woff2',
        href: '/fonts/NotoSansCJKjp-Bold.woff2',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/Loading.vue',

  /*
   ** Global CSS
   */
  css: ['normalize.css', '~/assets/style/main.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/mixin.js',
    '~/plugins/pagination.client.js',
    '~/plugins/mokuji.client.js',
    '~/plugins/highlight.client.js',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    '@nuxtjs/sitemap',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-50805440-1',
      },
    ],
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-7651142413133023',
      },
    ],
  ],

  styleResources: {
    sass: [
      '~/assets/style/Settings/_colors.scss',
      '~/assets/style/Settings/_variables.scss',
      '~/assets/style/Tools/_mixins.scss',
    ],
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: constant.SITE_URL,
    generate: true,
    async routes() {
      return await routeData().then(data => {
        return data.map(post => {
          return post.slug;
        });
      });
    },
  },

  workbox: {
    dev: true,
    offline: false,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\/wp-json\/.+/,
        handler: 'networkFirst',
        options: {
          cacheName: 'api',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      },
      {
        urlPattern: /^(https?):\/\/.*\/.*\.(jpg|png|svg)/,
        handler: 'cacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      },
    ],
  },

  manifest: {
    name: constant.SITE_NAME,
    short_name: constant.SITE_NAME,
    title: constant.SITE_NAME,
    'og:title': constant.SITE_NAME,
    description: constant.SITE_DESCRIPTION,
    'og:description': constant.SITE_DESCRIPTION,
    lang: 'ja',
    theme_color: '#ffffff',
    background_color: '#ffffff',
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: constant.ENDPOINT,
  },

  router: {
    scrollBehavior: function(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }

      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            loader: 'vue-svg-loader',
            options: {
              svgo: {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            },
          },
          {
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ],
      });
    },

    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-transform-runtime'],
        ['@babel/plugin-proposal-object-rest-spread'],
        ['@babel/plugin-syntax-dynamic-import'],
      ],
    },

    postcss: {
      preset: {
        stage: 3,
        autoprefixer: {
          grid: true,
          cascade: false,
        },
      },
      plugins: {
        'postcss-flexbugs-fixes': {},
        cssnano: {
          preset: [
            'default',
            {
              autoprefixer: false,
            },
          ],
        },
      },
    },
  },

  generate: {
    fallback: true,
    subFolders: false,
    interval: 1000,
    async routes() {
      return await routeData().then(data => {
        return data.map(post => {
          return {
            route: post.slug.replace('.html', ''),
          };
        });
      });
    },
  },
};
