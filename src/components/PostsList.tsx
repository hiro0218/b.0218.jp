import { defineComponent } from '@nuxtjs/composition-api';
import { Post, TermsPostLits } from '~/types/source';

export default defineComponent({
  name: 'PostsList',
  props: {
    posts: {
      type: Array as () => Array<Post | TermsPostLits>,
      required: false,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="post-list">
        {this.posts.map((post) => (
          <router-link to={'/' + post.path} class="c-card">
            <div class="c-card-body">
              <div class="c-card-body__title">{post.title}</div>
              {post.excerpt && <div class="c-card-body__description">{post.excerpt}</div>}
            </div>
          </router-link>
        ))}
      </div>
    );
  },
});
