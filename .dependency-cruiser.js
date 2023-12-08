/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* rules from the 'recommended' preset: */
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'この依存関係は循環関係になっています。解決策を再評価することが推奨されます（例えば、依存関係の反転を使用する、モジュールが一つの責任だけを持つようにする等）。',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      comment:
        'このモジュールは孤立しており、恐らくもはや使用されていない可能性があります。使用するか削除するか、あるいは依存関係の設定でこのモジュールに対する例外を追加してください。このルールはデフォルトでは、いくつかの特定のファイル（例：.eslintrc.jsやtsconfig.json）には適用されません。',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
          '\\.d\\.ts$', // TypeScript declaration files
          '(^|/)tsconfig\\.json$', // TypeScript config
          '(^|/)(babel|webpack|next|stylelint)\\.config\\.(js|cjs|mjs|ts|json)$', // other configs
        ],
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      comment:
        'このモジュールは非推奨のNodeのコアモジュールに依存しています。代替案が存在するはずですので、それを探してください。Nodeは軽々しく非推奨にしないので、注意が必要です。',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: [
          '^(v8/tools/codemap)$',
          '^(v8/tools/consarray)$',
          '^(v8/tools/csvparser)$',
          '^(v8/tools/logreader)$',
          '^(v8/tools/profile_view)$',
          '^(v8/tools/profile)$',
          '^(v8/tools/SourceMap)$',
          '^(v8/tools/splaytree)$',
          '^(v8/tools/tickprocessor-driver)$',
          '^(v8/tools/tickprocessor)$',
          '^(node-inspect/lib/_inspect)$',
          '^(node-inspect/lib/internal/inspect_client)$',
          '^(node-inspect/lib/internal/inspect_repl)$',
          '^(async_hooks)$',
          '^(punycode)$',
          '^(domain)$',
          '^(constants)$',
          '^(sys)$',
          '^(_linklist)$',
          '^(_stream_wrap)$',
        ],
      },
    },
    {
      name: 'not-to-deprecated',
      comment:
        'このモジュールは非推奨のnpmモジュール（またはそのバージョン）に依存しています。遅いバージョンにアップグレードするか、代わりとなるモジュールを見つけてください。非推奨のモジュールはセキュリティリスクとなる可能性があります。',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment:
        'このモジュールは、package.jsonのdependenciesセクションに記載されていないnpmパッケージに依存しています。この状態は問題であり、（1）本番環境で利用できないか、（2）本番環境で保証されていないバージョンで利用される可能性があります。package.jsonのdependenciesにこのパッケージを追加してください。',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },
    {
      name: 'not-to-unresolvable',
      comment:
        'このモジュールはディスク上で解決できないモジュールに依存しています。npmモジュールであればpackage.jsonに追加する必要があります。',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-duplicate-dep-types',
      comment:
        'このモジュールは、package.json内で複数回（例えば、devDependenciesとdependenciesの両方で）記載されているnpmパッケージに依存しています。これは後にメンテナンスの問題を引き起こす可能性があります。',
      severity: 'warn',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        // as it's pretty common to have a type import be a type only import
        // _and_ (e.g.) a devDependency - don't consider type-only dependency
        // types for this rule
        dependencyTypesNot: ['type-only'],
      },
    },

    /* rules you might want to tweak for your specific situation: */
    {
      name: 'not-to-spec',
      comment:
        'このモジュールはテストファイル（spec）に依存しています。テストファイルはコードをテストする単一の責任を持つべきです。もしその外の何かに使用されている場合は、それを（例えば）別のユーティリティやヘルパーに分離してください。',
      severity: 'error',
      from: {},
      to: {
        path: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$',
      },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        'このモジュールはpackage.jsonのdevDependenciesセクションにリストされているnpmパッケージに依存していますが、本番環境にデプロイされる可能性があります。package.jsonのdependenciesセクションにのみ記載するようにしてください。',
      from: {
        path: '^(src)',
        pathNot: '\\.(spec|test)\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\.md)$',
      },
      to: {
        dependencyTypes: ['npm-dev'],
      },
    },
    {
      name: 'optional-deps-used',
      severity: 'info',
      comment:
        'このモジュールはpackage.jsonでオプションとして指定されているnpmパッケージに依存しています。これは限られた状況でしか意味をなさないため、注意が必要です。',
      from: {},
      to: {
        dependencyTypes: ['npm-optional'],
      },
    },
    {
      name: 'peer-deps-used',
      comment:
        'このモジュールはpackage.jsonでピア依存として指定されているnpmパッケージに依存しています。このモジュールがプラグイン等であれば問題ないですが、それ以外の場合は注意が必要です。',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['npm-peer'],
      },
    },
  ],
  options: {
    /* conditions specifying which files not to follow further when encountered:
       - path: a regular expression to match
       - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md#dependencytypes-and-dependencytypesnot
       for a complete list
    */
    doNotFollow: {
      path: 'node_modules',
    },

    /* conditions specifying which dependencies to exclude
       - path: a regular expression to match
       - dynamic: a boolean indicating whether to ignore dynamic (true) or static (false) dependencies.
          leave out if you want to exclude neither (recommended!)
    */
    // exclude : {
    //   path: '',
    //   dynamic: true
    // },

    /* pattern specifying which files to include (regular expression)
       dependency-cruiser will skip everything not matching this pattern
    */
    // includeOnly : '',

    /* dependency-cruiser will include modules matching against the focus
       regular expression in its output, as well as their neighbours (direct
       dependencies and dependents)
    */
    // focus : '',

    /* list of module systems to cruise */
    // moduleSystems: ['amd', 'cjs', 'es6', 'tsd'],

    /* prefix for links in html and svg output (e.g. 'https://github.com/you/yourrepo/blob/develop/'
       to open it on your online repo or `vscode://file/${process.cwd()}/` to
       open it in visual studio code),
     */
    // prefix: '',

    /* false (the default): ignore dependencies that only exist before typescript-to-javascript compilation
       true: also detect dependencies that only exist before typescript-to-javascript compilation
       "specify": for each dependency identify whether it only exists before compilation or also after
     */
    tsPreCompilationDeps: true,

    /*
       list of extensions to scan that aren't javascript or compile-to-javascript.
       Empty by default. Only put extensions in here that you want to take into
       account that are _not_ parsable.
    */
    // extraExtensionsToScan: [".json", ".jpg", ".png", ".svg", ".webp"],

    /* if true combines the package.jsons found from the module up to the base
       folder the cruise is initiated from. Useful for how (some) mono-repos
       manage dependencies & dependency definitions.
     */
    // combinedDependencies: false,

    /* if true leave symlinks untouched, otherwise use the realpath */
    // preserveSymlinks: false,

    /* TypeScript project file ('tsconfig.json') to use for
       (1) compilation and
       (2) resolution (e.g. with the paths property)

       The (optional) fileName attribute specifies which file to take (relative to
       dependency-cruiser's current working directory). When not provided
       defaults to './tsconfig.json'.
     */
    tsConfig: {
      fileName: 'tsconfig.json',
    },

    /* Webpack configuration to use to get resolve options from.

       The (optional) fileName attribute specifies which file to take (relative
       to dependency-cruiser's current working directory. When not provided defaults
       to './webpack.conf.js'.

       The (optional) `env` and `arguments` attributes contain the parameters to be passed if
       your webpack config is a function and takes them (see webpack documentation
       for details)
     */
    // webpackConfig: {
    //  fileName: './webpack.config.js',
    //  env: {},
    //  arguments: {},
    // },

    /* Babel config ('.babelrc', '.babelrc.json', '.babelrc.json5', ...) to use
      for compilation (and whatever other naughty things babel plugins do to
      source code). This feature is well tested and usable, but might change
      behavior a bit over time (e.g. more precise results for used module
      systems) without dependency-cruiser getting a major version bump.
     */
    // babelConfig: {
    //   fileName: './.babelrc'
    // },

    /* List of strings you have in use in addition to cjs/ es6 requires
       & imports to declare module dependencies. Use this e.g. if you've
       re-declared require, use a require-wrapper or use window.require as
       a hack.
    */
    // exoticRequireStrings: [],
    /* options to pass on to enhanced-resolve, the package dependency-cruiser
       uses to resolve module references to disk. You can set most of these
       options in a webpack.conf.js - this section is here for those
       projects that don't have a separate webpack config file.

       Note: settings in webpack.conf.js override the ones specified here.
     */
    enhancedResolveOptions: {
      /* List of strings to consider as 'exports' fields in package.json. Use
         ['exports'] when you use packages that use such a field and your environment
         supports it (e.g. node ^12.19 || >=14.7 or recent versions of webpack).

         If you have an `exportsFields` attribute in your webpack config, that one
         will have precedence over the one specified here.
      */
      exportsFields: ['exports'],
      /* List of conditions to check for in the exports field. e.g. use ['imports']
         if you're only interested in exposed es6 modules, ['require'] for commonjs,
         or all conditions at once `(['import', 'require', 'node', 'default']`)
         if anything goes for you. Only works when the 'exportsFields' array is
         non-empty.

        If you have a 'conditionNames' attribute in your webpack config, that one will
        have precedence over the one specified here.
      */
      conditionNames: ['import', 'require', 'node', 'default'],
      /*
         The extensions, by default are the same as the ones dependency-cruiser
         can access (run `npx depcruise --info` to see which ones that are in
         _your_ environment. If that list is larger than what you need (e.g.
         it contains .js, .jsx, .ts, .tsx, .cts, .mts - but you don't use
         TypeScript you can pass just the extensions you actually use (e.g.
         [".js", ".jsx"]). This can speed up the most expensive step in
         dependency cruising (module resolution) quite a bit.
       */
      // extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      /*
         If your TypeScript project makes use of types specified in 'types'
         fields in package.jsons of external dependencies, specify "types"
         in addition to "main" in here, so enhanced-resolve (the resolver
         dependency-cruiser uses) knows to also look there. You can also do
         this if you're not sure, but still use TypeScript. In a future version
         of dependency-cruiser this will likely become the default.
       */
      mainFields: ['main', 'types'],
    },
    reporterOptions: {
      dot: {
        /* pattern of modules that can be consolidated in the detailed
           graphical dependency graph. The default pattern in this configuration
           collapses everything in node_modules to one folder deep so you see
           the external modules, but not the innards your app depends upon.
         */
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',

        /* Options to tweak the appearance of your graph.See
           https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md#reporteroptions
           for details and some examples. If you don't specify a theme
           don't worry - dependency-cruiser will fall back to the default one.
        */
        // theme: {
        //   graph: {
        //     /* use splines: "ortho" for straight lines. Be aware though
        //       graphviz might take a long time calculating ortho(gonal)
        //       routings.
        //    */
        //     splines: "true"
        //   },
        //   modules: [
        //     {
        //       criteria: { matchesFocus: true },
        //       attributes: {
        //         fillcolor: "lime",
        //         penwidth: 2,
        //       },
        //     },
        //     {
        //       criteria: { matchesFocus: false },
        //       attributes: {
        //         fillcolor: "lightgrey",
        //       },
        //     },
        //     {
        //       criteria: { matchesReaches: true },
        //       attributes: {
        //         fillcolor: "lime",
        //         penwidth: 2,
        //       },
        //     },
        //     {
        //       criteria: { matchesReaches: false },
        //       attributes: {
        //         fillcolor: "lightgrey",
        //       },
        //     },
        //     {
        //       criteria: { source: "^src/model" },
        //       attributes: { fillcolor: "#ccccff" }
        //     },
        //     {
        //       criteria: { source: "^src/view" },
        //       attributes: { fillcolor: "#ccffcc" }
        //     },
        //   ],
        //   dependencies: [
        //     {
        //       criteria: { "rules[0].severity": "error" },
        //       attributes: { fontcolor: "red", color: "red" }
        //     },
        //     {
        //       criteria: { "rules[0].severity": "warn" },
        //       attributes: { fontcolor: "orange", color: "orange" }
        //     },
        //     {
        //       criteria: { "rules[0].severity": "info" },
        //       attributes: { fontcolor: "blue", color: "blue" }
        //     },
        //     {
        //       criteria: { resolved: "^src/model" },
        //       attributes: { color: "#0000ff77" }
        //     },
        //     {
        //       criteria: { resolved: "^src/view" },
        //       attributes: { color: "#00770077" }
        //     }
        //   ]
        // }
      },
      archi: {
        /* pattern of modules that can be consolidated in the high level
          graphical dependency graph. If you use the high level graphical
          dependency graph reporter (`archi`) you probably want to tweak
          this collapsePattern to your situation.
        */
        collapsePattern: '^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/(@[^/]+/[^/]+|[^/]+)',

        /* Options to tweak the appearance of your graph.See
           https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md#reporteroptions
           for details and some examples. If you don't specify a theme
           for 'archi' dependency-cruiser will use the one specified in the
           dot section (see above), if any, and otherwise use the default one.
         */
        // theme: {
        // },
      },
      text: {
        highlightFocused: true,
      },
      /** @see https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md#markdown */
      markdown: {
        // Whether or not to show a title in the report. Defaults to true.
        showTitle: true,
        // The text to show as a title of the report.
        title: '## dependency-cruiser 禁断の依存性チェック - 検索結果',

        // Whether or not to show a summary in the report
        showSummary: true,
        // Whether or not to give the summary a header
        showSummaryHeader: true,
        // The text to show as a header on top of the summary
        summaryHeader: '### 概要',
        // Whether or not to show high level stats in the summary
        showStatsSummary: true,
        // Whether or not to show a list of violated rules in the summary
        showRulesSummary: true,
        // Whether or not to show a detailed list of violations
        showDetails: true,
        // Whether or not to show ignored violations in the detailed list.
        includeIgnoredInDetails: true,
        // Whether or not to give the detailed list of violations a header
        showDetailsHeader: true,
        // The text to show as a header on top of the detailed list of violations
        detailsHeader: '### すべての違反',
        // Whether or not to collapse the list of violations in a <details> block
        // especially practical when the list of violations is still large.
        collapseDetails: true,
        // The text to in the <summary> section of the <details> block
        collapsedMessage: '違反が見つかりました - クリックして拡大',
        // The text to show when no violations were found
        noViolationsMessage: '違反は見つかりませんでした。',

        // Whether or not to show a footer (with version & run date) at the bottom of the report
        showFooter: false,
      },
    },
  },
};
// generated: dependency-cruiser@13.0.2 on 2023-05-30T15:30:55.772Z
