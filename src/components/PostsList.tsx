import { defineComponent } from '@nuxtjs/composition-api';

import { Post, TermsPostLits } from '~/types/source';
import { convertDateToSimpleFormat } from '~/utils/date';

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
              <div class="c-card-body__description">
                {post.date && <time datetime={post.date}>{convertDateToSimpleFormat(post.date)}</time>}
                {post.excerpt && ': ' + post.excerpt}
              </div>
            </div>
          </router-link>
        ))}
      </div>
    );
  },
});
