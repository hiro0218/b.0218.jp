module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-var': 0,
    'no-unused-vars': ['error', {
      args: 'none'
    }],
    'no-underscore-dangle': 0,
    'no-inner-declarations': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-arrow-callback': 0,
    'no-continue': 0,
    'object-shorthand': 0,
    'quotes': ['error', 'single'],
    'no-param-reassign': 0,
    'vars-on-top': 0,
    'func-names': 0,
    'consistent-return': 0,
    'global-require': 0,
    'vue/max-attributes-per-line': 'off',
    'vue/no-v-html': 0,
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
      }
    }],
    'vue/singleline-html-element-content-newline': 0,
  }
}
