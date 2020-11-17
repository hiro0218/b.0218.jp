import { defineComponent, reactive, computed } from '@vue/composition-api';

type ArchivePost = {
  title: string;
  data: string;
  path: string;
}

export default defineComponent({
  name: 'Search',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit, root }) {
    const data = reactive({
      keyword: '',
      suggest: [],
    });

    const archives = computed(() => {
      // @ts-ignore
      return root.context.app.$source.archives;
    });

    function onClose() {
      data.keyword = '';
      data.suggest = [];
      emit('done');
    }

    function onKeyup(e: KeyboardEvent) {
      const value = (e.target as HTMLInputElement).value.trim();

      // Enterを押した場合
      if (!e.isComposing && e.key === 'Enter') {
        // 入力値が同じなら検索しない
        if (value === data.keyword) {
          return;
        }

        // 入力値が空
        if (!value) {
          data.keyword = '';
          data.suggest = [];
          return;
        }

        data.suggest = archives.value.filter((post: ArchivePost) => {
          // AND検索のため入力値をスペースで区切って、それぞれの条件に一致するか
          return value.toLowerCase().split(' ').every(el => post.title.toLowerCase().includes(el));
        });
        data.keyword = value;
      }
    }

    return {
      data,
      archives,
      onClose,
      onKeyup,
    };
  },
  render() {
    return (
      <div class={this.isOpen && 'is-open-search'} style={'display:' + (this.isOpen ? 'block' : 'none')}>
        <div class="c-search">
          <div class="c-search-header">
            <label class="c-search-header__icon" for="search-input">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <input type="search" class="c-search__input" placeholder="記事のタイトルから検索する" id="search-input" autocomplete="off" value={this.data.keyword} onKeyup={(e) => this.onKeyup(e)} />
          </div>
          {this.data.suggest.length > 0 && (
          <div class="c-search-body">
            <ul class="c-search-list">
              {Array.from(this.data.suggest).map((post: ArchivePost) => {
                return (
                  <li class="c-search-list__item">
                    <router-link to={post.path} class="c-search-list__link">{post.title}</router-link>
                  </li>
                );
              })}
            </ul>
          </div>
          )}
          <div class="c-search-footer">
            <div class="c-search-footer__search-result">
              {this.data.suggest.length > 0 && (
                <span>Result: {this.data.suggest.length} posts</span>
              )}
            </div>
            <div class="c-search-footer__search-external">
              <a href="https://www.google.com/search?q=site:b.0218.jp" target="_blank" rel="noopener">Google 検索</a>
            </div>
          </div>
        </div>
        <div class="c-search-overlay" onClick={this.onClose}></div>
      </div>
    );
  },
});
