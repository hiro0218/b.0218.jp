import { NuxtConfig } from '@nuxt/types';

import CONSTANT from './src/constant';

const getRoutes = require('./routes.js');

const config: NuxtConfig = {
  target: 'static',

  srcDir: 'src',

  server: {
    port: 1218,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: CONSTANT.SITE_NAME,
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
      lang: 'ja',
    },
    titleTemplate: `%s - ${CONSTANT.SITE_NAME}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', hid: 'viewport', content: 'width=device-width' },
      { hid: 'description', name: 'description', content: CONSTANT.SITE_DESCRIPTION },
      { hid: 'og:site_name', property: 'og:site_name', content: CONSTANT.SITE_NAME },
      { hid: 'og:locale', property: 'og:locale', content: 'ja_JP' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: CONSTANT.SITE_URL },
      { hid: 'og:title', property: 'og:title', content: CONSTANT.SITE_NAME },
      { hid: 'og:description', property: 'og:description', content: CONSTANT.SITE_DESCRIPTION },
      { hid: 'og:image', property: 'og:image', content: CONSTANT.AUTHOR_ICON },
      { name: 'twitter:site', content: '@hiro0218' },
      { name: 'twitter:creator', content: '@hiro0218' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'fb:app_id', content: '1042526022490602' },
    ],
    link: [
      { rel: 'dns-prefetch', href: '//partner.googlesyndication.com' },
      { rel: 'dns-prefetch', href: '//pagead2.googlesyndication.com' },
      { rel: 'dns-prefetch', href: '//www.googletagservices.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'dns-prefetch', href: '//adservice.google.com' },
      { rel: 'dns-prefetch', href: '//adservice.google.co.jp' },
      { rel: 'dns-prefetch', href: '//platform.twitter.com' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'alternate', type: 'application/rss+xml', href: 'https://b.0218.jp/rss.xml' },
      { rel: 'alternate', type: 'application/atom+xml', href: 'https://b.0218.jp/atom.xml' },
      { rel: 'alternate', type: 'application/json', href: 'https://b.0218.jp/feed.json' },
      { rel: 'search', type: 'application/opensearchdescription+xml', href: '/opensearch.xml' },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: ['~/assets/style/main.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/filteredPost' },
    { src: '~/plugins/mokuji.ts', mode: 'client' },
    { src: '~/plugins/source.ts' },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa', '@nuxtjs/svg'],

  buildModules: ['@nuxtjs/google-analytics', '@nuxt/typescript-build', '@nuxtjs/composition-api'],

  components: true,

  googleAnalytics: {
    id: 'UA-50805440-1',
  },

  manifest: {
    name: CONSTANT.SITE_NAME,
    short_name: CONSTANT.SITE_NAME,
    title: CONSTANT.SITE_NAME,
    'og:title': CONSTANT.SITE_NAME,
    description: CONSTANT.SITE_DESCRIPTION,
    'og:description': CONSTANT.SITE_DESCRIPTION,
    lang: 'ja',
    theme_color: '#ffffff',
    background_color: '#ffffff',
  },

  typescript: {
    typeCheck: {
      eslint: {
        files: './src/**/*.{ts,tsx,js,vue}',
      },
    },
    ignoreNotFoundWarnings: true,
  },

  /*
   ** Build configuration
   */
  build: {
    parallel: true,

    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ];
      },
    },

    postcss: {
      preset: {
        stage: 3,
        autoprefixer: {
          grid: 'autoplace',
          cascade: false,
        },
        features: {
          'custom-properties': false, // for modern
          'nesting-rules': true,
        },
      },
      plugins: {
        'postcss-calc': {},
        'postcss-mixins': {},
        'postcss-nested': {},
        'postcss-extend': {},
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

export default config;
