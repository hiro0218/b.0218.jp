import constant from './constant';
const Sass = require('sass');
const Fiber = require('fibers');

const getRoutes = require('./routes.js');

export default {
  modern: 'client',

  env: {
    ...constant,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.SITE_NAME,
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
    },
    titleTemplate: (titleChunk: String) => {
      return titleChunk ? `${titleChunk} - ${process.env.SITE_NAME}` : process.env.SITE_NAME;
    },
    meta: [
      { hid: 'description', name: 'description', content: constant.SITE_DESCRIPTION },
      { hid: 'og:site_name', property: 'og:site_name', content: constant.SITE_NAME },
      { hid: 'og:locale', property: 'og:locale', content: 'ja_JP' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: constant.SITE_URL },
      { hid: 'og:title', property: 'og:title', content: constant.SITE_NAME },
      { hid: 'og:description', property: 'og:description', content: constant.SITE_DESCRIPTION },
      { hid: 'og:image', property: 'og:image', content: constant.AUTHOR_ICON },
      { name: 'twitter:site', content: '@hiro0218' },
      { name: 'twitter:creator', content: '@hiro0218' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'fb:app_id', content: '1042526022490602' },
      { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
    ],
    link: [
      { rel: 'dns-prefetch', href: '//adservice.google.com' },
      { rel: 'dns-prefetch', href: '//cdn.polyfill.io' },
      { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//pagead2.googlesyndication.com' },
      { rel: 'dns-prefetch', href: '//www.googletagservices.com' },
      { rel: 'dns-prefetch', href: '//googleads.g.doubleclick.net' },
      { rel: 'dns-prefetch', href: '//adservice.google.com' },
      { rel: 'dns-prefetch', href: '//adservice.google.co.jp' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', href: 'https://b.0218.jp/rss.xml' },
      { rel: 'alternate', type: 'application/atom+xml', href: 'https://b.0218.jp/atom.xml' },
      { rel: 'alternate', type: 'application/json', href: 'https://b.0218.jp/feed.json' },
      { rel: 'search', type: 'application/opensearchdescription+xml', href: '/opensearch.xml' },
      { itemprop: 'author', href: 'https://b.0218.jp/about/' },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/TheLoading.vue',

  /*
   ** Global CSS
   */
  css: ['normalize.css', '~/assets/style/main.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/composition-api',
    '~/plugins/fontawesome.js',
    '~/plugins/mixin.js',
    '~/plugins/mokuji.client.js',
    '~/plugins/source.js',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-7651142413133023',
      },
    ],
    '@nuxtjs/svg',
    'nuxt-webfontloader',
  ],

  buildModules: [
    '@nuxtjs/google-analytics',
    // TODO: Remove when upgrading to nuxt 2.13+
    '@nuxt/components',
    '@nuxt/typescript-build',
  ],

  googleAnalytics: {
    id: 'UA-50805440-1',
  },

  styleResources: {
    scss: ['~/assets/style/Settings/index.scss', '~/assets/style/Tools/index.scss'],
  },

  workbox: {
    offline: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^(https?):\/\/.*\/.*\.(jpg|png|svg)/,
        handler: 'cacheFirst',
        strategyOptions: {
          cacheName: 'images',
          cacheExpiration: {
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

  webfontloader: {
    google: {
      families: ['Noto+Sans+JP:400,900&display=swap'],
    },
  },

  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },

  /*
   ** Build configuration
   */
  build: {
    parallel: true,

    extractCSS: process.env.NODE_ENV === 'production',
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },

    loaders: {
      scss: {
        implementation: Sass,
        sassOptions: {
          fiber: Fiber,
        },
      },
    },

    /*
     ** You can extend webpack config here
     */
    extend(config: any, ctx: any) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }

      config.module.rules.push({
        test: /\.(html|xml|xsl|txt)$/,
        loader: 'raw-loader',
      });

      // fix for _vm._ssrNode is not a function for functional component
      // @see https://github.com/nuxt/nuxt.js/issues/2565
      config.module.rules.forEach((rule: any) => {
        if (rule.test.toString() === '/\\.vue$/') {
          rule.options.optimizeSSR = false;
        }
      });

      config.module.rules.unshift({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      });

      // Overcome webpack referencing `window` in chunks
      config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    },

    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              ie: '11',
            },
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
          grid: 'autoplace',
          cascade: false,
        },
      },
      plugins: {
        'postcss-flexbugs-fixes': {},
        'postcss-sort-media-queries': {
          sort: 'mobile-first',
        },
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
    routes() {
      return getRoutes();
    },
  },
};
