import type { Config } from '@markuplint/ml-config';

const config: Config = {
  excludeFiles: [
    '**/*.ts', // TypeScriptファイル（JSXなし）
    '**/*.test.tsx', // テストファイル
    '.next/**', // Next.jsビルド成果物
    'styled-system/**', // Panda CSSビルド成果物
    '_article/**', // Git submodule（読み取り専用）
    'public/**/*.html', // サイト所有権の確認用 HTML（Google・Pinterest・Yandex が内容を指定する）
  ],
  parser: {
    '\\.[jt]sx?$': '@markuplint/jsx-parser',
  },
  specs: {
    '\\.[jt]sx?$': '@markuplint/react-spec',
  },
  extends: ['markuplint:recommended-react'],
  pretenders: [
    {
      // as の値を要素名として読む既定にしない。IconLink の as は 'link' | 'externalLink' の判別で、link は HTML の link 要素ではなく、a 要素として描画されるため
      // as を文字列（'a'）にしない。属性が引き継がれず、href と aria-label が見えなくなって、アクセシブルネームの検査が効かないため
      selector: 'IconLink',
      as: { element: 'a', inheritAttrs: true },
    },
  ],
  rules: {
    // no-event-handler-attr を使わない。JSX の onClick などは React の props で、HTML のインライン属性としては出力されず、警告がすべて実害のないものになるため
    'security/no-event-handler-attr': false,
    // onPointer 系の props を未知の属性にしない。react-spec が React のポインタイベントの props を知らないため
    // nodeRules の * に書かない。同じ詳細度の rdfa プリセットを置き換え、meta の property が未知の属性になるため
    'no-unknown-attr': { options: { ignoreAttrNamePrefix: 'onPointer' } },
  },
  nodeRules: [
    {
      // html の permitted-contents を使わない。head は Next.js が挿入するので、ルートレイアウトには書かないため
      selector: 'html',
      rules: { 'permitted-contents': false },
    },
    {
      // link[rel="search"] の link-types を使わない。React が link を head へ移す（ビルド後の HTML でも head にある）が、link-types は JSX 上の body 内という位置で判定するため
      selector: 'link[rel="search"]',
      rules: { 'link-types': false },
    },
  ],
  // reset にしない。既定の reset では、overrides に当たったファイルの設定が丸ごと置き換わり、parser と specs が外れて lint されなくなるため
  overrideMode: 'merge',
  overrides: {
    // stories の見本の href は、飛び先の ID を持たない。リンクを押す操作のテストに使うだけなので、no-broken-fragment-link を使わない
    'src/**/*.stories.tsx': {
      rules: { 'a11y/no-broken-fragment-link': false },
    },
  },
};

export default config;
