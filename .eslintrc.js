/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:import-x/recommended',
    'plugin:import-x/typescript',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['import', 'simple-import-sort', '@typescript-eslint', 'unused-imports', 'react-hooks'],
  settings: {
    // @see https://github.com/import-js/eslint-import-resolver-typescript#configuration
    'import-x/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    /**
     * eslint
     */
    // プログラムで許可される最大循環的複雑性を強制する
    complexity: ['error', 10],
    // 古いパターンよりもスプレッド演算子(...)の使用を強制する
    'prefer-spread': 'error',
    // 文字列連結の代わりにテンプレートリテラルを要求する
    'prefer-template': 'error',

    /**
     * eslint-config-next
     */
    '@next/next/no-img-element': 'off',

    /**
     * @typescript-eslint/eslint-plugin
     */
    // `Array<T>` 形式を禁止して `T[]` の使用を推奨する
    '@typescript-eslint/array-type': 'warn',
    // 一貫した型エクスポートの使用を強制する
    '@typescript-eslint/consistent-type-exports': 'error',
    // 一貫した型のインポートの使用を強制する
    '@typescript-eslint/consistent-type-imports': 'warn',
    // エクスポートされた関数とクラスのパブリッククラスメソッドに明示的な戻り値と引数の型を要求する
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // コードベース全体でのすべての命名規則を強制する
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should'],
      },
    ],
    // 空のオブジェクト、論理的なand、論理的なorを使用する代わりに、簡潔なオプションチェーン式を使用することを強制
    '@typescript-eslint/prefer-optional-chain': 'error',
    // 文字列の部分文字列をチェックする他の同等のメソッドの代わりに、String#startsWithとString#endsWithの使用を強制
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',

    /**
     * eslint-plugin-import-x
     */
    // インポートがファイルの先頭にあることを確認する
    'import-x/first': 'error',
    // すべてのインポートがファイルの先頭にあることを確認する
    'import-x/newline-after-import': 'error',
    // 未割り当てのインポートを禁止する
    'import-x/no-unassigned-import': 'off',
    // デフォルトエクスポートを禁止する
    'import-x/no-default-export': 'off',
    // モジュールが自身への依存パスを持つモジュールをインポートすることを禁止する
    'import-x/no-cycle': 'off',
    // ファイルパス内でのファイル拡張子の使用を一貫させる
    'import-x/extensions': 'off',
    // モジュールが単一の名前または複数の名前をエクスポートする場合は、デフォルトエクスポートを優先する
    'import-x/prefer-default-export': 'off',
    // 同じモジュールの複数箇所での繰り返しインポートを禁止する
    'import-x/no-duplicates': ['error', { considerQueryString: true }],
    // 無関係なパッケージの使用を禁止
    'import-x/no-extraneous-dependencies': 'error',

    /**
     * eslint-plugin-react
     */
    // JSXコンポーネントのプロパティがアルファベット順に並べ替えられていることを確認する
    'react/jsx-sort-props': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /**
     * eslint-plugin-simple-import-sort
     */
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    /**
     * eslint-plugin-unused-imports
     */
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
