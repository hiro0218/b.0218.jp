import { constant, route } from './settings';

module.exports = {
  env: {
    AUTHOR: constant.AUTHOR,
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
      { hid: 'og:image', property: 'og:image', content: 'https://b.0218.jp/hiro0218.png' },
      { name: 'twitter:site', content: '@hiro0218' },
      { name: 'twitter:creator', content: '@hiro0218' },
      { name: 'twitter:card', content: 'summary' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
    '~/plugins/mixin',
    { src: '~/plugins/pagination', ssr: false },
    { src: '~/plugins/mokuji', ssr: false },
    { src: '~/plugins/highlight', ssr: false },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module#usage
    '@nuxtjs/dotenv',
    [
      'nuxt-sass-resources-loader',
      [
        '~/assets/style/Settings/_colors.scss',
        '~/assets/style/Settings/_variables.scss',
        '~/assets/style/Tools/_mixins.scss',
      ],
    ],
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: constant.ENDPOINT,
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

    postcss: [
      require('autoprefixer')({
        grid: true,
        cascade: false,
      }),
      require('postcss-flexbugs-fixes')(),
      require('postcss-preset-env')({
        stage: 3,
      }),
      require('cssnano')({
        preset: [
          'default',
          {
            autoprefixer: false,
          },
        ],
      }),
    ],
  },

  generate: {
    fallback: true,
    subFolders: false,
    interval: 1000,
    routes() {
      return route.getData();
    },
  },
};
