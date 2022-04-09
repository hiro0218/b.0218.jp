const fs = require('fs');
const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath));
  while (true) {
      if (fs.existsSync(path.join(currDir, 'package.json'))) {
          return currDir;
      }
      const { dir, root } = path.parse(currDir);
      if (dir === root) {
          throw new Error(`Could not find package.json in the parent directories starting from ${filepath}.`);
      }
      currDir = dir;
  }
}

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-addon-next-router',
    'storybook-addon-turbo-build',
  ],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,

          /**
           * Map Emotion 10 libraries to Emotion 11 libraries.
           *
           * Otherwise Storybook fails to compile with "Module not found: Error: Can't resolve '@emotion/styled/base'", etc.
           * It wasn't necessary to do this until we imported React component using "@emotion/styled".
           * This issue is probably caused because Storybook uses Emotion 10 while we have Emotion 11 used by the Next.js app.
           *
           * @see https://github.com/storybookjs/storybook/issues/13277#issuecomment-751747964
           */
          '@emotion/core': getPackageDir('@emotion/react'),
          '@emotion/styled': getPackageDir('@emotion/styled'),
          'emotion-theming': getPackageDir('@emotion/react'),
        },
      },
    };
  },
};
