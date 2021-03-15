module.exports = {
  async rewrites() {
    return [
      {
        source: '/:slug*.html', // Old url with .html
        destination: '/:slug*', // Redirect without .html
      },
    ];
  },
};
