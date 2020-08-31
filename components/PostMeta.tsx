import { defineComponent, computed } from '@vue/composition-api';
import { convertDateToSimpleFormat, isSameDate } from '~/assets/script/utils/date.ts';

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
      type: Array,
      required: false,
      default: () => [],
    },
    postTag: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup({ date, updated }) {
    const stringPublishDate = computed(() => {
      return convertDateToSimpleFormat(date);
    });
    const stringModifiyDate = computed(() => {
      return convertDateToSimpleFormat(updated);
    });
    const isModified = computed(() => {
      return isSameDate(date, updated);
    });

    return {
      stringPublishDate,
      stringModifiyDate,
      isModified,
    };
  },
  render() {
    return (
      <div class="post-meta">
        <div class="c-post-meta">
          <div class="c-post-meta__item--date">
            <time datetime={this.date} itemprop="datePublished">
              {this.stringPublishDate}
            </time>
          </div>
          {!this.isModified && (
            <div class="c-post-meta__item--date">
              <time datetime={this.updated} itemprop="dateModified">
                {this.stringModifiyDate}
              </time>
            </div>
          )}
        </div>

        {this.postCategory.length !== 0 && (
          <div class="c-post-meta">
            {this.postCategory.map((category) => (
              <div class="c-post-meta__item--separator">
                <a href={'/' + category.path} class="c-post-meta__link--category">
                  {category.name}
                </a>
              </div>
            ))}
          </div>
        )}

        {this.postTag.length !== 0 && (
          <div class="c-post-meta">
            {this.postTag.map((tag) => (
              <div class="c-post-meta__item--separator">
                <a href={'/' + tag.path} class="c-post-meta__link--tag">
                  {tag.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
});
