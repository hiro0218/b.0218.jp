import { ComponentMeta, ComponentStory } from '@storybook/react';

import PostPager from '../components/PostPager';

export default {
  title: 'Components/PostPager',
  component: PostPager,
} as ComponentMeta<typeof PostPager>;

const Template: ComponentStory<typeof PostPager> = (args) => <PostPager {...args} />;

export const Default = Template.bind({});
Default.args = {
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
  ...Default.args,
  prev: {},
};

export const Prev = Template.bind({});
Prev.args = {
  ...Default.args,
  next: {},
};
