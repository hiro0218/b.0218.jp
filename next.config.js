const withReactSvg = require('next-react-svg');
const path = require('path');

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'images'),

  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'UA-50805440-1',
  },

  future: {
    webpack5: true,
  },

  async rewrites() {
    return [
      {
        source: '/:slug*.html', // Old url with .html
        destination: '/:slug*', // Redirect without .html
      },
    ];
  },
});
