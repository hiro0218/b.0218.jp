/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    [
      'next/babel',
      {
        "preset-env": {
          "targets": {
            "browsers": ">1%, not dead, not ie 11, not op_mini all"
          },
        },
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: [
    [
      '@emotion/babel-plugin',
      {
        importMap: {
          '@/ui/styled': {
            styled: {
              canonicalImport: ['@emotion/styled', 'default'],
              styledBaseImport: ['@/ui/styled', 'styled'],
            },
          },
        },
      },
    ],
  ],
}
