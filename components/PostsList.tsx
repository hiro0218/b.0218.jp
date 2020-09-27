export default {
  name: 'PostsList',
  props: {
    posts: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="post-list">
        {this.posts.map((post) => (
          <router-link to={'/' + post.path} class="c-card">
            <div class="c-card-image">
              <div class="c-card-image__container">
                <div class="c-card-image__no-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="c-card-body">
              <div class="c-card-body__title">{post.title}</div>
              {post.excerpt && <div class="c-card-body__description">{post.excerpt}</div>}
            </div>
          </router-link>
        ))}
      </div>
    );
  },
};
