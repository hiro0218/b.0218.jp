import { defineComponent } from '@nuxtjs/composition-api';

import { TermsPostList } from '~/types/source';
import { convertDateToSimpleFormat, isSameDate } from '~/utils/date.ts';

export default defineComponent({
  name: 'PostMeta',
  props: {
    date: {
      type: String,
      required: true,
    },
    updated: {
      type: String,
      required: false,
      default: '',
    },
    postCategory: {
      type: Array as () => Array<TermsPostList>,
      required: false,
      default: () => [],
    },
    postTag: {
      type: Array as () => Array<TermsPostList>,
      required: false,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="post-meta">
        <div class="c-post-meta">
          <div class="c-post-meta__item--date">
            <time datetime={this.date} itemprop="datePublished">
              {convertDateToSimpleFormat(this.date)}
            </time>
          </div>
          {!isSameDate(this.date, this.updated) && (
            <div class="c-post-meta__item--date">
              <time datetime={this.updated} itemprop="dateModified">
                {convertDateToSimpleFormat(this.updated)}
              </time>
            </div>
          )}
        </div>

        {this.postCategory.length !== 0 && (
          <div class="c-post-meta">
            {this.postCategory.map((category) => (
              <div class="c-post-meta__item--separator">
                <nuxt-link to={'/' + category.path} no-prefetch class="c-post-meta__link--category">
                  {category.name}
                </nuxt-link>
              </div>
            ))}
          </div>
        )}

        {this.postTag.length !== 0 && (
          <div class="c-post-meta">
            {this.postTag.map((tag) => (
              <div class="c-post-meta__item--separator">
                <nuxt-link to={'/' + tag.path} no-prefetch class="c-post-meta__link--tag">
                  {tag.name}
                </nuxt-link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
});
