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
                <div class="c-card-image__no-item" domPropsInnerHTML={this.$icon.image} />
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
