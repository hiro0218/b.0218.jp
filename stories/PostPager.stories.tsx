import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostPager from '../components/PostPager';

export default {
  title: 'Components/PostPager',
  component: PostPager,
} as ComponentMeta<typeof PostPager>;

const Template: ComponentStory<typeof PostPager> = (args) => <PostPager {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  next: {
    title: 'post title',
    slug: '#',
  },
  prev: {
    title: 'post title',
    slug: '#',
  },
};

export const Next = Template.bind({});
Next.args = {
  ...Normal.args,
  prev: {},
};

export const Prev = Template.bind({});
Prev.args = {
  ...Normal.args,
  next: {},
};
